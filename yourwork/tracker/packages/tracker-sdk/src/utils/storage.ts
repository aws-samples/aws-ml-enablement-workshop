const STORAGE_KEY = 'mlew_tracker_';

export class Storage {
  static get(key: string): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY + key);
    } catch {
      return null;
    }
  }

  static set(key: string, value: string): void {
    try {
      localStorage.setItem(STORAGE_KEY + key, value);
    } catch {
      // Ignore storage errors
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(STORAGE_KEY + key);
    } catch {
      // Ignore storage errors
    }
  }

  static getJson<T>(key: string): T | null {
    const value = this.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  static setJson<T>(key: string, value: T): void {
    try {
      this.set(key, JSON.stringify(value));
    } catch {
      // Ignore storage errors
    }
  }
}