import type { Tracker } from './Tracker.js';

export class AutoTracker {
  private tracker: Tracker;
  private isEnabled = false;

  constructor(tracker: Tracker) {
    this.tracker = tracker;
  }

  enable(): void {
    if (this.isEnabled) return;
    
    this.isEnabled = true;
    this.setupEventListeners();
  }

  disable(): void {
    if (!this.isEnabled) return;
    
    this.isEnabled = false;
    this.removeEventListeners();
  }

  private setupEventListeners(): void {
    // Click tracking
    document.addEventListener('click', this.handleClick);
    
    // Page view tracking
    window.addEventListener('popstate', this.handlePageView);
    
    // Form submission tracking
    document.addEventListener('submit', this.handleFormSubmit);

    // 初回ページビューを記録
    this.handlePageView();
  }

  private removeEventListeners(): void {
    document.removeEventListener('click', this.handleClick);
    window.removeEventListener('popstate', this.handlePageView);
    document.removeEventListener('submit', this.handleFormSubmit);
  }

  private handleClick = (event: MouseEvent): void => {
    if (!this.isEnabled) return;
    
    const target = event.target as HTMLElement;
    
    // イベントバブリングをチェック - 最も近いdata-track要素を探す
    let trackElement = target;
    while (trackElement) {
      if (trackElement.dataset?.track === 'true') {
        const trackData = this.extractTrackingData(trackElement);
        if (trackData) {
          this.tracker.trackClick(trackData.name, trackData.properties);
        }
        // 一度だけ送信して終了（親要素は無視）
        return;
      }
      trackElement = trackElement.parentElement as HTMLElement;
      
      // bodyまで到達したら終了
      if (trackElement === document.body) break;
    }
  };

  private handlePageView = (): void => {
    if (!this.isEnabled) return;
    
    this.tracker.trackView(window.location.pathname, {
      title: document.title,
      referrer: document.referrer,
    });
  };

  private handleFormSubmit = (event: SubmitEvent): void => {
    if (!this.isEnabled) return;
    
    const target = event.target as HTMLFormElement;
    const trackData = this.extractTrackingData(target);
    
    if (trackData) {
      this.tracker.track('form-submit', {
        formName: trackData.name,
        ...trackData.properties,
      });
    }
  };

  private extractTrackingData(element: HTMLElement) {
    // data-track="true" が設定されている要素のみトラッキング
    if (element.dataset.track !== 'true') {
      return null;
    }

    const name = element.dataset.trackName || element.id || element.className || 'unnamed-element';
    
    return {
      name,
      properties: {
        elementType: element.tagName.toLowerCase(),
        className: element.className,
        id: element.id,
        page: window.location.pathname,
        category: element.dataset.trackCategory,
        section: element.dataset.trackSection,
        type: element.dataset.trackType,
        ...this.parseCustomDataAttributes(element),
      },
    };
  }

  private parseCustomDataAttributes(element: HTMLElement): Record<string, any> {
    const customProps: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(element.dataset)) {
      if (key.startsWith('track') && key !== 'track' && key !== 'trackName') {
        // data-track-* 属性をカスタムプロパティとして追加
        const propName = key.replace('track', '').toLowerCase();
        customProps[propName] = value;
      }
    }
    
    return customProps;
  }
}