export interface AnalyticsEvent {
  eventId: string;
  applicationId: string;
  applicationName: string;
  eventType: 'click' | 'view' | 'custom';
  timestamp: number;
  
  elementName?: string;
  elementType?: string;
  page?: string;
  url?: string;
  
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

export interface Application {
  id: string;
  name: string;
  totalEvents: number;
  lastActivity: number;
}

export interface SummaryResponse {
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
  periodComparison?: {
    events: number;
    users: number;
    sessions: number;
    sessionTime: number;
  };
}

export interface EventsResponse {
  events: AnalyticsEvent[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
  };
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}