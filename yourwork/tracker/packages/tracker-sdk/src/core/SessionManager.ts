import { nanoid } from 'nanoid';
import { Storage } from '../utils/storage.js';

export class SessionManager {
  private sessionId: string;
  private sessionStart: number;
  private readonly sessionTimeout: number;

  constructor(sessionTimeout = 30 * 60 * 1000) { // 30 minutes
    this.sessionTimeout = sessionTimeout;
    this.sessionStart = Date.now();
    
    // 既存セッションの復元またはセッション新規作成
    const storedSession = Storage.getJson<{
      sessionId: string;
      sessionStart: number;
    }>('session');
    
    const now = Date.now();
    if (storedSession && (now - storedSession.sessionStart) < this.sessionTimeout) {
      // 既存セッション継続
      this.sessionId = storedSession.sessionId;
      this.sessionStart = storedSession.sessionStart;
    } else {
      // 新規セッション作成
      this.sessionId = nanoid();
      this.persistSession();
    }
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getSessionDuration(): number {
    return Date.now() - this.sessionStart;
  }

  refreshSession(): void {
    // セッション延長
    this.persistSession();
  }

  newSession(): void {
    // 強制的に新しいセッション開始
    this.sessionId = nanoid();
    this.sessionStart = Date.now();
    this.persistSession();
  }

  private persistSession(): void {
    Storage.setJson('session', {
      sessionId: this.sessionId,
      sessionStart: this.sessionStart,
    });
  }
}