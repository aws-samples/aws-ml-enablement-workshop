import { nanoid } from 'nanoid';
import type { TrackerConfig, AnalyticsEvent } from '../types/index.js';
import { SessionManager } from './SessionManager.js';
import { EventQueue } from './EventQueue.js';
import { AutoTracker } from './AutoTracker.js';
import { Storage } from '../utils/storage.js';

export class Tracker {
  private config: TrackerConfig;
  private sessionManager: SessionManager;
  private eventQueue: EventQueue;
  private autoTracker: AutoTracker;
  private userId?: string;
  private enabled = true;
  private readonly version = '1.0.0';

  constructor(config: TrackerConfig) {
    // 重複初期化の警告
    if (typeof window !== 'undefined' && (window as any).__MLEW_TRACKER_INITIALIZED__) {
      console.warn('[MLEW Tracker] Warning: Tracker has already been initialized. Multiple instances may cause duplicate events.');
    }
    
    this.config = {
      apiEndpoint: 'http://localhost:3001',
      autoTrack: true,
      flushInterval: 5000,
      maxQueueSize: 10,
      debug: false,
      ...config,
    };
    
    // 初期化フラグを設定
    if (typeof window !== 'undefined') {
      (window as any).__MLEW_TRACKER_INITIALIZED__ = true;
    }

    this.sessionManager = new SessionManager();
    this.eventQueue = new EventQueue(this.config);
    this.autoTracker = new AutoTracker(this);

    // 保存されているユーザーIDを復元
    const savedUserId = Storage.get('userId');
    this.userId = savedUserId || undefined;

    // 自動トラッキングを有効化
    if (this.config.autoTrack) {
      this.autoTracker.enable();
    }

    // ページ離脱時にキューをフラッシュ
    this.setupUnloadHandler();
    
    if (this.config.debug) {
      console.log('[MLEW Tracker] Initialized:', this.config);
    }
  }

  track(eventType: string, properties?: Record<string, any>): void {
    if (!this.enabled) return;

    const event = this.createEvent('custom', properties, eventType);
    this.eventQueue.enqueue(event);
  }

  trackClick(elementName: string, properties?: Record<string, any>): void {
    if (!this.enabled) return;

    const event = this.createEvent('click', {
      elementName,
      ...properties,
    });
    this.eventQueue.enqueue(event);
  }

  trackView(page: string, properties?: Record<string, any>): void {
    if (!this.enabled) return;

    const event = this.createEvent('view', {
      page,
      ...properties,
    });
    this.eventQueue.enqueue(event);
  }

  setUserId(userId: string): void {
    this.userId = userId;
    Storage.set('userId', userId);
    
    if (this.config.debug) {
      console.log('[MLEW Tracker] User ID set:', userId);
    }
  }

  setUserProperties(properties: Record<string, any>): void {
    // ユーザープロパティ設定のイベントを送信
    this.track('user-properties', properties);
  }

  async flush(): Promise<void> {
    await this.eventQueue.flush();
  }

  enable(): void {
    this.enabled = true;
    if (this.config.autoTrack) {
      this.autoTracker.enable();
    }
  }

  disable(): void {
    this.enabled = false;
    this.autoTracker.disable();
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getSessionId(): string {
    return this.sessionManager.getSessionId();
  }

  getUserId(): string | undefined {
    return this.userId;
  }

  private createEvent(
    eventType: 'click' | 'view' | 'custom',
    properties?: Record<string, any>,
    customEventType?: string
  ): AnalyticsEvent {
    const now = Date.now();
    
    // セッション延長
    this.sessionManager.refreshSession();

    return {
      eventId: nanoid(),
      applicationId: this.config.applicationId,
      applicationName: this.config.applicationName,
      eventType: customEventType ? 'custom' : eventType,
      timestamp: now,
      
      // イベント詳細
      elementName: properties?.elementName,
      elementType: properties?.elementType,
      page: properties?.page || window.location.pathname,
      url: window.location.href,
      
      // セッション情報
      sessionId: this.sessionManager.getSessionId(),
      userId: this.userId,
      
      // 環境情報
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      
      // カスタムプロパティ
      properties: {
        ...properties,
        ...(customEventType && { customEventType }),
      },
      
      // メタデータ
      createdAt: new Date(now).toISOString(),
      version: this.version,
    };
  }

  private setupUnloadHandler(): void {
    const handleUnload = () => {
      // 同期的にフラッシュ（ページ離脱前）
      if (this.eventQueue) {
        this.eventQueue.flush();
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
  }
}