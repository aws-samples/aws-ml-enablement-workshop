export { Tracker } from './core/Tracker.js';
export type { 
  TrackerConfig, 
  AnalyticsEvent, 
  EventBatch 
} from './types/index.js';

// デフォルトエクスポート（CDN使用時）
import { Tracker } from './core/Tracker.js';
export default { Tracker };