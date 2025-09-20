import { DynamoDBStreamEvent, DynamoDBRecord } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';
import { unmarshall } from '@aws-sdk/util-dynamodb';

// Initialize AWS clients
const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const cloudwatchClient = new CloudWatchClient({});

// Environment variables
const AGGREGATIONS_TABLE = process.env.AGGREGATIONS_TABLE!;
const ENVIRONMENT = process.env.ENVIRONMENT || 'dev';

interface AggregationUpdate {
  applicationId: string;
  timestamp: number;
  eventType: string;
  userId?: string;
  sessionId: string;
  page?: string;
}

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  console.log(`Processing ${event.Records.length} stream records`);

  const aggregations = new Map<string, AggregationUpdate[]>();

  // Group events by application and time period
  for (const record of event.Records) {
    if (record.eventName === 'INSERT' || record.eventName === 'MODIFY') {
      const update = processRecord(record);
      if (update) {
        const key = `${update.applicationId}#${getHourKey(update.timestamp)}`;
        if (!aggregations.has(key)) {
          aggregations.set(key, []);
        }
        aggregations.get(key)!.push(update);
      }
    }
  }

  // Update aggregations
  const updatePromises: Promise<void>[] = [];
  for (const [key, updates] of aggregations) {
    updatePromises.push(updateAggregations(key, updates));
  }

  await Promise.all(updatePromises);

  // Send metrics
  await sendMetrics(aggregations.size, event.Records.length);
};

function processRecord(record: DynamoDBRecord): AggregationUpdate | null {
  try {
    if (!record.dynamodb?.NewImage) {
      return null;
    }

    const item = unmarshall(record.dynamodb.NewImage as any);
    
    return {
      applicationId: item.applicationId,
      timestamp: item.timestamp,
      eventType: item.eventType,
      userId: item.userId,
      sessionId: item.sessionId,
      page: item.page
    };
  } catch (error) {
    console.error('Error processing record:', error);
    return null;
  }
}

async function updateAggregations(key: string, updates: AggregationUpdate[]): Promise<void> {
  const [applicationId, period] = key.split('#');
  const timestamp = parseInt(period);

  // Calculate aggregated metrics
  const totalEvents = updates.length;
  const uniqueUsers = new Set(updates.map(u => u.userId).filter(Boolean));
  const uniqueSessions = new Set(updates.map(u => u.sessionId));
  
  // Count events by type
  const eventTypeCounts: Record<string, number> = {};
  updates.forEach(update => {
    eventTypeCounts[update.eventType] = (eventTypeCounts[update.eventType] || 0) + 1;
  });

  // Count page views
  const pageCounts: Record<string, number> = {};
  updates.filter(u => u.eventType === 'view' && u.page).forEach(update => {
    pageCounts[update.page!] = (pageCounts[update.page!] || 0) + 1;
  });

  try {
    // Update hourly aggregation
    await docClient.send(new UpdateCommand({
      TableName: AGGREGATIONS_TABLE,
      Key: {
        applicationIdPeriod: `${applicationId}#hourly`,
        timestamp
      },
      UpdateExpression: `
        SET totalEvents = if_not_exists(totalEvents, :zero) + :events,
            uniqueUsers = if_not_exists(uniqueUsers, :emptySet) + :users,
            sessions = if_not_exists(sessions, :zero) + :sessions,
            lastUpdated = :now
        ADD eventTypes.#click :clickCount,
            eventTypes.#view :viewCount,
            eventTypes.#custom :customCount
      `,
      ExpressionAttributeNames: {
        '#click': 'click',
        '#view': 'view',
        '#custom': 'custom'
      },
      ExpressionAttributeValues: {
        ':zero': 0,
        ':emptySet': new Set(),
        ':events': totalEvents,
        ':users': uniqueUsers,
        ':sessions': uniqueSessions.size,
        ':clickCount': eventTypeCounts.click || 0,
        ':viewCount': eventTypeCounts.view || 0,
        ':customCount': eventTypeCounts.custom || 0,
        ':now': Date.now()
      }
    }));

    // Update daily aggregation
    const dayTimestamp = getDateTimestamp(timestamp);
    await docClient.send(new UpdateCommand({
      TableName: AGGREGATIONS_TABLE,
      Key: {
        applicationIdPeriod: `${applicationId}#daily`,
        timestamp: dayTimestamp
      },
      UpdateExpression: `
        SET totalEvents = if_not_exists(totalEvents, :zero) + :events,
            uniqueUsers = if_not_exists(uniqueUsers, :emptySet) + :users,
            sessions = if_not_exists(sessions, :zero) + :sessions,
            lastUpdated = :now
      `,
      ExpressionAttributeValues: {
        ':zero': 0,
        ':emptySet': new Set(),
        ':events': totalEvents,
        ':users': uniqueUsers,
        ':sessions': uniqueSessions.size,
        ':now': Date.now()
      }
    }));

    console.log(`Updated aggregations for ${applicationId}: ${totalEvents} events`);
  } catch (error) {
    console.error('Error updating aggregations:', error);
    throw error;
  }
}

async function sendMetrics(aggregationCount: number, recordCount: number): Promise<void> {
  try {
    await cloudwatchClient.send(new PutMetricDataCommand({
      Namespace: 'MLEWW3/Analytics',
      MetricData: [
        {
          MetricName: 'StreamRecordsProcessed',
          Value: recordCount,
          Unit: 'Count',
          Timestamp: new Date(),
          Dimensions: [
            { Name: 'Environment', Value: ENVIRONMENT }
          ]
        },
        {
          MetricName: 'AggregationsUpdated',
          Value: aggregationCount,
          Unit: 'Count',
          Timestamp: new Date(),
          Dimensions: [
            { Name: 'Environment', Value: ENVIRONMENT }
          ]
        }
      ]
    }));
  } catch (error) {
    console.error('Error sending metrics:', error);
  }
}

function getHourKey(timestamp: number): string {
  const date = new Date(timestamp);
  date.setMinutes(0, 0, 0);
  return date.getTime().toString();
}

function getDateTimestamp(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}