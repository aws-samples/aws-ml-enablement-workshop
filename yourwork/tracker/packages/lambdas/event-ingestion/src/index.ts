import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

// Initialize AWS clients
const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Environment variables
const EVENTS_TABLE = process.env.EVENTS_TABLE!;
const APPLICATIONS_TABLE = process.env.APPLICATIONS_TABLE!;
const EVENT_TTL_DAYS = Number(process.env.EVENT_TTL_DAYS ?? '30');

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
      eventId: event.eventId || randomUUID(),
      applicationId: batch.applicationId,
      timestampEventId: `${event.timestamp}#${event.eventId || randomUUID()}`,
      date: new Date(event.timestamp).toISOString().split('T')[0],
      ttl: Math.floor(Date.now() / 1000) + EVENT_TTL_DAYS * 24 * 60 * 60
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
