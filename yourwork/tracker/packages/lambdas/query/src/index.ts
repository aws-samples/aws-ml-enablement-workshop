import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

// Helper function to convert query string parameters
function normalizeQueryParams(params: APIGatewayProxyEventQueryStringParameters | null): Record<string, string> {
  if (!params) return {};
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      normalized[key] = value as string;
    }
  }
  return normalized;
}

// Initialize AWS clients
const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Environment variables
const EVENTS_TABLE = process.env.EVENTS_TABLE!;
const AGGREGATIONS_TABLE = process.env.AGGREGATIONS_TABLE!;
const APPLICATIONS_TABLE = process.env.APPLICATIONS_TABLE!;

interface Application {
  id: string;
  name: string;
  totalEvents: number;
  lastActivity: number;
  createdAt: number;
}

interface DashboardSummary {
  totalEvents: number;
  uniqueUsers: number;
  sessions: number;
  avgSessionTime: number;
  topEvents: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  topPages: Array<{
    page: string;
    views: number;
    percentage: number;
  }>;
  timeSeriesData: Array<{
    time: string;
    events: number;
    users: number;
  }>;
  periodComparison: {
    events: number;
    users: number;
    sessions: number;
    sessionTime: number;
  };
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Request:', JSON.stringify(event));

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: getCorsHeaders(),
      body: ''
    };
  }

  try {
    const path = event.path;
    const method = event.httpMethod;

    // Route to appropriate handler
    if (path === '/v1/analytics/applications' && method === 'GET') {
      return await getApplications();
    } else if (path.match(/\/v1\/analytics\/([^\/]+)\/summary/) && method === 'GET') {
      const appId = event.pathParameters?.appId;
      if (!appId) {
        return errorResponse(400, 'Application ID is required');
      }
      return await getApplicationSummary(appId, normalizeQueryParams(event.queryStringParameters));
    } else if (path.match(/\/v1\/analytics\/([^\/]+)\/events/) && method === 'GET') {
      const appId = event.pathParameters?.appId;
      if (!appId) {
        return errorResponse(400, 'Application ID is required');
      }
      return await getEvents(appId, normalizeQueryParams(event.queryStringParameters));
    } else {
      return errorResponse(404, 'Not found');
    }
  } catch (error) {
    console.error('Error:', error);
    return errorResponse(500, 'Internal server error');
  }
};

async function getApplications(): Promise<APIGatewayProxyResult> {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: APPLICATIONS_TABLE,
      ProjectionExpression: 'applicationId, applicationName, totalEvents, lastActivity, createdAt'
    }));

    const applications: Application[] = (result.Items || []).map((item: any) => ({
      id: item.applicationId,
      name: item.applicationName || item.applicationId,
      totalEvents: item.totalEvents || 0,
      lastActivity: item.lastActivity || 0,
      createdAt: item.createdAt || Date.now()
    }));

    return {
      statusCode: 200,
      headers: getCorsHeaders(),
      body: JSON.stringify({
        applications,
        count: applications.length
      })
    };
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
}

async function getApplicationSummary(
  applicationId: string,
  queryParams: Record<string, string>
): Promise<APIGatewayProxyResult> {
  try {
    const startTime = queryParams?.startTime ? parseInt(queryParams.startTime) : Date.now() - 7 * 24 * 60 * 60 * 1000;
    const endTime = queryParams?.endTime ? parseInt(queryParams.endTime) : Date.now();
    const startDate = queryParams?.startDate || new Date(startTime).toISOString().split('T')[0];
    const endDate = queryParams?.endDate || new Date(endTime).toISOString().split('T')[0];

    // Get aggregated data
    const aggregationResult = await docClient.send(new QueryCommand({
      TableName: AGGREGATIONS_TABLE,
      KeyConditionExpression: 'applicationIdPeriod = :appPeriod AND #ts BETWEEN :start AND :end',
      ExpressionAttributeNames: {
        '#ts': 'timestamp'
      },
      ExpressionAttributeValues: {
        ':appPeriod': `${applicationId}#daily`,
        ':start': new Date(startDate).getTime(),
        ':end': new Date(endDate).getTime()
      }
    }));

    // Get recent events for detailed analysis
    const eventsResult = await docClient.send(new QueryCommand({
      TableName: EVENTS_TABLE,
      KeyConditionExpression: 'applicationId = :appId',
      ExpressionAttributeValues: {
        ':appId': applicationId
      },
      Limit: 1000,
      ScanIndexForward: false // Get most recent events
    }));

    const events = eventsResult.Items || [];
    const aggregations = aggregationResult.Items || [];

    // Calculate summary metrics
    const summary = calculateSummary(events, aggregations, startTime, endTime);

    return {
      statusCode: 200,
      headers: getCorsHeaders(),
      body: JSON.stringify(summary)
    };
  } catch (error) {
    console.error('Error fetching summary:', error);
    throw error;
  }
}

async function getEvents(
  applicationId: string,
  queryParams: Record<string, string>
): Promise<APIGatewayProxyResult> {
  try {
    const limit = parseInt(queryParams?.limit || '100');
    const startDate = queryParams?.startDate;
    const endDate = queryParams?.endDate;
    const eventType = queryParams?.eventType;

    let queryExpression = 'applicationId = :appId';
    let expressionValues: Record<string, any> = {
      ':appId': applicationId
    };

    if (startDate && endDate) {
      queryExpression += ' AND timestampEventId BETWEEN :start AND :end';
      expressionValues[':start'] = `${new Date(startDate).getTime()}`;
      expressionValues[':end'] = `${new Date(endDate).getTime()}`;
    }

    const result = await docClient.send(new QueryCommand({
      TableName: EVENTS_TABLE,
      KeyConditionExpression: queryExpression,
      ExpressionAttributeValues: expressionValues,
      Limit: limit,
      ScanIndexForward: false
    }));

    let events = result.Items || [];

    // Filter by event type if specified
    if (eventType) {
      events = events.filter((e: any) => e.eventType === eventType);
    }

    return {
      statusCode: 200,
      headers: getCorsHeaders(),
      body: JSON.stringify({
        events,
        count: events.length,
        lastEvaluatedKey: result.LastEvaluatedKey
      })
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

function calculateSummary(events: any[], aggregations: any[], startTime: number, endTime: number): DashboardSummary {
  // Filter events by selected time period
  const filteredEvents = events.filter(event => {
    // timestamp is already a Unix timestamp in milliseconds
    const eventTime = typeof event.timestamp === 'number' ? event.timestamp : new Date(event.timestamp).getTime();
    return eventTime >= startTime && eventTime <= endTime;
  });

  // Calculate basic metrics
  const totalEvents = filteredEvents.length;
  const uniqueUsers = new Set(filteredEvents.map(e => e.userId).filter(Boolean)).size;
  const sessions = new Set(filteredEvents.map(e => e.sessionId)).size;
  
  // Calculate average session time (simplified)
  const avgSessionTime = sessions > 0 ? Math.floor(totalEvents * 30 / sessions) : 0;

  // Calculate top events (using filtered events)
  const eventCounts: Record<string, number> = {};
  filteredEvents.forEach(event => {
    const key = event.elementName || event.eventType;
    eventCounts[key] = (eventCounts[key] || 0) + 1;
  });

  const topEvents = Object.entries(eventCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalEvents > 0 ? (count / totalEvents) * 100 : 0
    }));

  // Calculate top pages (using filtered events)
  const pageCounts: Record<string, number> = {};
  // Include all events with page information, not just 'view' type
  filteredEvents.filter(e => e.page).forEach(event => {
    const page = event.page || '/';
    pageCounts[page] = (pageCounts[page] || 0) + 1;
  });

  const totalPageViews = Object.values(pageCounts).reduce((sum, views) => sum + views, 0);
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([page, views]) => ({
      page,
      views,
      percentage: totalPageViews > 0 ? (views / totalPageViews) * 100 : 0
    }));

  // Generate time series data based on selected period
  const timeSeriesData: Array<{ time: string; events: number; users: number }> = [];
  const periodDuration = endTime - startTime;
  const dayInMs = 24 * 60 * 60 * 1000;
  const hourInMs = 60 * 60 * 1000;
  
  if (periodDuration <= dayInMs) {
    // For periods <= 1 day, show hourly data
    const hours = Math.ceil(periodDuration / hourInMs);
    for (let i = 0; i < hours; i++) {
      const timePoint = startTime + i * hourInMs;
      const hour = new Date(timePoint);
      const hourStr = hour.toISOString().split(':')[0];
      const hourEvents = filteredEvents.filter(e => {
        const eventTime = typeof e.timestamp === 'number' ? e.timestamp : new Date(e.timestamp).getTime();
        return eventTime >= timePoint && eventTime < timePoint + hourInMs;
      });
      
      timeSeriesData.push({
        time: hour.toISOString(),
        events: hourEvents.length,
        users: new Set(hourEvents.map(e => e.userId).filter(Boolean)).size
      });
    }
  } else {
    // For periods > 1 day, show daily data
    const days = Math.ceil(periodDuration / dayInMs);
    for (let i = 0; i < days; i++) {
      const timePoint = startTime + i * dayInMs;
      const day = new Date(timePoint);
      const dayStr = day.toISOString().split('T')[0];
      const dayEvents = filteredEvents.filter(e => {
        const eventTime = typeof e.timestamp === 'number' ? e.timestamp : new Date(e.timestamp).getTime();
        return eventTime >= timePoint && eventTime < timePoint + dayInMs;
      });
      
      timeSeriesData.push({
        time: new Date(timePoint).toISOString(),
        events: dayEvents.length,
        users: new Set(dayEvents.map(e => e.userId).filter(Boolean)).size
      });
    }
  }

  // Mock period comparison (would need historical data)
  const periodComparison = {
    events: Math.random() * 20 - 10,
    users: Math.random() * 20 - 10,
    sessions: Math.random() * 20 - 10,
    sessionTime: Math.random() * 10 - 5
  };

  return {
    totalEvents,
    uniqueUsers,
    sessions,
    avgSessionTime,
    topEvents,
    topPages,
    timeSeriesData,
    periodComparison
  };
}

function getDefaultStartDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().split('T')[0];
}

function getDefaultEndDate(): string {
  return new Date().toISOString().split('T')[0];
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

function errorResponse(statusCode: number, message: string): APIGatewayProxyResult {
  return {
    statusCode,
    headers: getCorsHeaders(),
    body: JSON.stringify({ error: message })
  };
}