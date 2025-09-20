import type { Application, SummaryResponse, EventsResponse } from '../types/index.js';
import { awsConfig, getApiHeaders } from '../config/aws.js';

class AnalyticsClient {
  private baseURL: string;

  constructor(baseURL = awsConfig.apiEndpoint) {
    this.baseURL = baseURL;
  }

  async getApplications(): Promise<{ applications: Application[] }> {
    const response = await fetch(`${this.baseURL}/v1/analytics/applications`, {
      headers: getApiHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async getSummary(
    applicationId: string, 
    params: {
      startTime: number;
      endTime: number;
      granularity?: string;
    }
  ): Promise<SummaryResponse> {
    const queryString = new URLSearchParams({
      startTime: params.startTime.toString(),
      endTime: params.endTime.toString(),
      granularity: params.granularity || 'day',
    }).toString();
    
    const response = await fetch(
      `${this.baseURL}/v1/analytics/${applicationId}/summary?${queryString}`,
      {
        headers: getApiHeaders(),
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }

  async getEvents(
    applicationId: string,
    params: {
      startTime?: number;
      endTime?: number;
      eventType?: string;
      page?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<EventsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.startTime) queryParams.set('startTime', params.startTime.toString());
    if (params.endTime) queryParams.set('endTime', params.endTime.toString());
    if (params.eventType) queryParams.set('eventType', params.eventType);
    if (params.page) queryParams.set('page', params.page);
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.offset) queryParams.set('offset', params.offset.toString());
    
    const response = await fetch(
      `${this.baseURL}/v1/analytics/${applicationId}/events?${queryParams.toString()}`,
      {
        headers: getApiHeaders(),
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${this.baseURL}/health`, {
      headers: getApiHeaders(),
    });
    if (!response.ok) {
      throw new Error('API Server is not responding');
    }
    return response.json();
  }
}

export const analyticsClient = new AnalyticsClient();