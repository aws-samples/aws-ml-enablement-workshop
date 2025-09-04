// MLEW Tracker Service - Simplified integration for unified template
// Only uses trackClick and trackView as per requirements

declare global {
  interface Window {
    MLEWTracker?: {
      Tracker: new (config: any) => {
        trackClick: (elementName: string, properties?: Record<string, any>) => void;
        trackView: (pageName: string, properties?: Record<string, any>) => void;
        setUserId: (userId: string) => void;
      };
    };
    tracker?: {
      trackClick: (elementName: string, properties?: Record<string, any>) => void;
      trackView: (pageName: string, properties?: Record<string, any>) => void;
      setUserId: (userId: string) => void;
    };
  }
}

export interface TrackingProperties {
  [key: string]: string | number | boolean;
}

class MLEWTrackerService {
  private isReady = false;
  private pendingEvents: Array<{ type: 'click' | 'view'; name: string; properties?: TrackingProperties }> = [];

  constructor() {
    this.init();
  }

  private init() {
    // Wait for MLEW Tracker to be available
    if (typeof window !== 'undefined') {
      if (window.tracker) {
        this.isReady = true;
        this.flushPendingEvents();
      } else {
        // Check every 100ms for up to 5 seconds
        let attempts = 0;
        const checkTracker = () => {
          attempts++;
          if (window.tracker) {
            this.isReady = true;
            this.flushPendingEvents();
            console.log('[MLEW Tracker] Successfully connected');
          } else if (attempts < 50) {
            setTimeout(checkTracker, 100);
          } else {
            console.warn('[MLEW Tracker] Failed to connect after 5 seconds');
          }
        };
        checkTracker();
      }
    }
  }

  private flushPendingEvents() {
    if (this.isReady && window.tracker) {
      this.pendingEvents.forEach(event => {
        if (event.type === 'click') {
          window.tracker!.trackClick(event.name, event.properties);
        } else if (event.type === 'view') {
          window.tracker!.trackView(event.name, event.properties);
        }
      });
      this.pendingEvents = [];
    }
  }

  /**
   * Track click events on buttons, links, and other interactive elements
   */
  trackClick(elementName: string, properties?: TrackingProperties) {
    if (this.isReady && window.tracker) {
      window.tracker.trackClick(elementName, properties);
      console.log('[MLEW Tracker] Click tracked:', elementName, properties);
    } else {
      // Queue event if tracker not ready
      this.pendingEvents.push({ type: 'click', name: elementName, properties });
      console.log('[MLEW Tracker] Click queued:', elementName, properties);
    }
  }

  /**
   * Track view events for pages and sections
   */
  trackView(pageName: string, properties?: TrackingProperties) {
    if (this.isReady && window.tracker) {
      window.tracker.trackView(pageName, properties);
      console.log('[MLEW Tracker] View tracked:', pageName, properties);
    } else {
      // Queue event if tracker not ready
      this.pendingEvents.push({ type: 'view', name: pageName, properties });
      console.log('[MLEW Tracker] View queued:', pageName, properties);
    }
  }

  /**
   * Convenience method for tracking navigation clicks
   */
  trackNavigation(linkName: string, destination: string, source: string) {
    this.trackClick(`nav-${linkName}`, {
      destination,
      source,
      type: 'navigation'
    });
  }

  /**
   * Convenience method for tracking CTA button clicks
   */
  trackCTAClick(buttonText: string, location: string, destination: string) {
    this.trackClick(`cta-${buttonText.toLowerCase().replace(/\s+/g, '-')}`, {
      buttonText,
      location,
      destination,
      type: 'cta'
    });
  }

  /**
   * Convenience method for tracking form submissions
   */
  trackFormSubmit(formName: string, source: string) {
    this.trackClick(`form-${formName}`, {
      formName,
      source,
      type: 'form-submit'
    });
  }

  /**
   * Convenience method for tracking page views
   */
  trackPageView(pageName: string, section?: string) {
    this.trackView(pageName, {
      ...(section && { section }),
      url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: Date.now()
    });
  }

  /**
   * Check if tracker is ready
   */
  isTrackerReady(): boolean {
    return this.isReady;
  }

  /**
   * Get pending events count (useful for debugging)
   */
  getPendingEventsCount(): number {
    return this.pendingEvents.length;
  }
}

// Export singleton instance
export const mlewTracker = new MLEWTrackerService();

// Export for convenience
export default mlewTracker;