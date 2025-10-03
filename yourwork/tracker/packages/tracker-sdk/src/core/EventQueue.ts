import type { AnalyticsEvent, EventBatch, TrackerConfig } from '../types/index.js';

export class EventQueue {
  private queue: AnalyticsEvent[] = [];
  private flushTimer: number | null = null;
  private readonly config: TrackerConfig;

  constructor(config: TrackerConfig) {
    this.config = {
      apiEndpoint: 'http://localhost:3001',
      flushInterval: 5000,
      maxQueueSize: 10,
      ...config,
    };
  }

  enqueue(event: AnalyticsEvent): void {
    this.queue.push(event);
    
    if (this.config.debug) {
      console.log('[MLEW Tracker] Event queued:', event);
    }
    
    if (this.queue.length >= (this.config.maxQueueSize ?? 10)) {
      this.flush();
    } else if (!this.flushTimer) {
      this.scheduleFlush();
    }
  }

  async flush(): Promise<void> {
    if (this.queue.length === 0) return;
    
    const events = this.queue.splice(0);
    this.clearFlushTimer();
    
    if (this.config.debug) {
      console.log(`[MLEW Tracker] Flushing ${events.length} events`);
    }
    
    await this.sendEvents(events);
  }

  private scheduleFlush(): void {
    this.flushTimer = window.setTimeout(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private clearFlushTimer(): void {
    if (this.flushTimer) {
      window.clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }

  private async sendEvents(events: AnalyticsEvent[]): Promise<void> {
    try {
      const batch: EventBatch = {
        applicationId: this.config.applicationId,
        events: events.map(event => {
          const { applicationId, ...eventData } = event;
          return eventData;
        }),
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add API Key if provided
      if (this.config.apiKey) {
        headers['X-Api-Key'] = this.config.apiKey;
      }

      const response = await fetch(`${this.config.apiEndpoint}/v1/events`, {
        method: 'POST',
        headers,
        body: JSON.stringify(batch),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (this.config.debug) {
        console.log('[MLEW Tracker] Events sent successfully:', result);
      }
    } catch (error) {
      console.warn('[MLEW Tracker] Failed to send events:', error);
      
      // 失敗したイベントを再キューに戻す（オプション）
      // this.queue.unshift(...events);
    }
  }
}