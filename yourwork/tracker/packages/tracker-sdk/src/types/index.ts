export interface TrackerConfig {
  applicationId: string;
  applicationName: string;
  apiEndpoint?: string;
  apiKey?: string;
  autoTrack?: boolean;
  flushInterval?: number; // ms
  maxQueueSize?: number;
  debug?: boolean;
}

export interface AnalyticsEvent {
  eventId: string;
  applicationId: string;
  applicationName: string;
  eventType: 'click' | 'view' | 'custom';
  timestamp: number;
  
  // イベント詳細
  elementName?: string;
  elementType?: string;
  page: string;
  url: string;
  
  // セッション情報
  sessionId: string;
  userId?: string;
  
  // 環境情報
  userAgent?: string;
  viewport?: {
    width: number;
    height: number;
  };
  
  // カスタムプロパティ
  properties?: Record<string, any>;
  
  // メタデータ
  createdAt: string;
  version: string;
}

export interface EventBatch {
  applicationId: string;
  events: Omit<AnalyticsEvent, 'applicationId'>[];
}