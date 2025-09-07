import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { CloudWatchClient, PutMetricDataCommand, StandardUnit } from '@aws-sdk/client-cloudwatch';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';

// Initialize AWS clients
const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const cloudwatchClient = new CloudWatchClient({});
const s3Client = new S3Client({});

// Environment variables
const EVENTS_TABLE = process.env.EVENTS_TABLE!;
const APPLICATIONS_TABLE = process.env.APPLICATIONS_TABLE!;
const ARCHIVE_BUCKET = process.env.ARCHIVE_BUCKET!;
const ENVIRONMENT = process.env.ENVIRONMENT || 'dev';

interface AnalyticsEvent {
  eventId: string;
  applicationId: string;
  applicationName: string;
  eventType: 'click' | 'view' | 'custom';
  timestamp: number;
  elementName?: string;
  elementType?: string;
  page: string;
  url: string;
  sessionId: string;
  userId?: string;
  userAgent?: string;
  viewport?: {
    width: number;
    height: number;
  };
  properties?: Record<string, any>;
  createdAt: string;
  version: string;
}

interface EventBatch {
  applicationId: string;
  events: Omit<AnalyticsEvent, 'applicationId'>[];
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Event received:', JSON.stringify(event));

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: getCorsHeaders(),
      body: ''
    };
  }

  try {
    // Parse request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers: getCorsHeaders(),
        body: JSON.stringify({ error: 'No request body' })
      };
    }

    const batch: EventBatch = JSON.parse(event.body);
    
    // Validate events
    if (!batch.applicationId || !batch.events || !Array.isArray(batch.events)) {
      return {
        statusCode: 400,
        headers: getCorsHeaders(),
        body: JSON.stringify({ error: 'Invalid event format' })
      };
    }

    // Process events
    const processedEvents = batch.events.map(event => ({
      ...event,
      eventId: event.eventId || nanoid(),
      applicationId: batch.applicationId,
      timestampEventId: `${event.timestamp}#${event.eventId || nanoid()}`,
      date: new Date(event.timestamp).toISOString().split('T')[0],
      ttl: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days TTL
    }));

    // Batch write to DynamoDB (max 25 items per batch)
    const chunks = chunkArray(processedEvents, 25);
    const writePromises = chunks.map(chunk => 
      docClient.send(new BatchWriteCommand({
        RequestItems: {
          [EVENTS_TABLE]: chunk.map(item => ({
            PutRequest: { Item: item }
          }))
        }
      }))
    );

    await Promise.all(writePromises);

    // Update application statistics
    await updateApplicationStats(batch.applicationId, batch.events.length);

    // Send metrics to CloudWatch
    await sendMetrics(batch.applicationId, batch.events);

    // Archive to S3 (async, don't wait)
    archiveEvents(batch.applicationId, processedEvents).catch(console.error);

    return {
      statusCode: 200,
      headers: getCorsHeaders(),
      body: JSON.stringify({
        success: true,
        processedCount: batch.events.length,
        message: 'Events processed successfully'
      })
    };

  } catch (error) {
    console.error('Error processing events:', error);
    
    // Send error metric
    await sendErrorMetric(error);

    return {
      statusCode: 500,
      headers: getCorsHeaders(),
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

async function updateApplicationStats(applicationId: string, eventCount: number): Promise<void> {
  try {
    await docClient.send(new UpdateCommand({
      TableName: APPLICATIONS_TABLE,
      Key: { applicationId },
      UpdateExpression: `
        SET totalEvents = if_not_exists(totalEvents, :zero) + :count,
            lastActivity = :now,
            updatedAt = :now
        ADD eventCount :count
      `,
      ExpressionAttributeValues: {
        ':count': eventCount,
        ':zero': 0,
        ':now': Date.now()
      }
    }));
  } catch (error) {
    console.error('Error updating application stats:', error);
  }
}

async function sendMetrics(applicationId: string, events: any[]): Promise<void> {
  const metrics = [
    {
      MetricName: 'EventsProcessed',
      Value: events.length,
      Unit: StandardUnit.Count,
      Timestamp: new Date(),
      Dimensions: [
        { Name: 'ApplicationId', Value: applicationId },
        { Name: 'Environment', Value: ENVIRONMENT }
      ]
    },
    {
      MetricName: 'UniqueUsers',
      Value: new Set(events.map(e => e.userId).filter(Boolean)).size,
      Unit: StandardUnit.Count,
      Timestamp: new Date(),
      Dimensions: [
        { Name: 'ApplicationId', Value: applicationId },
        { Name: 'Environment', Value: ENVIRONMENT }
      ]
    }
  ];

  try {
    await cloudwatchClient.send(new PutMetricDataCommand({
      Namespace: 'MLEWW3/Analytics',
      MetricData: metrics
    }));
  } catch (error) {
    console.error('Error sending metrics:', error);
  }
}

async function sendErrorMetric(error: any): Promise<void> {
  try {
    await cloudwatchClient.send(new PutMetricDataCommand({
      Namespace: 'MLEWW3/Analytics',
      MetricData: [{
        MetricName: 'EventsFailed',
        Value: 1,
        Unit: StandardUnit.Count,
        Timestamp: new Date(),
        Dimensions: [
          { Name: 'Environment', Value: ENVIRONMENT },
          { Name: 'ErrorType', Value: error.name || 'Unknown' }
        ]
      }]
    }));
  } catch (metricError) {
    console.error('Error sending error metric:', metricError);
  }
}

async function archiveEvents(applicationId: string, events: any[]): Promise<void> {
  const now = new Date();
  const key = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${applicationId}/${now.getHours()}/events-${Date.now()}.json`;

  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: ARCHIVE_BUCKET,
      Key: key,
      Body: JSON.stringify(events),
      ContentType: 'application/json',
      ContentEncoding: 'gzip'
    }));
  } catch (error) {
    console.error('Error archiving events:', error);
  }
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function getCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Accept,Origin,Referer,User-Agent',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,HEAD',
    'Access-Control-Allow-Credentials': 'false',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
    'Vary': 'Origin'
  };
}