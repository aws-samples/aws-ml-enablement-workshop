/**
 * App URL Configuration
 * ビルド時に環境変数 VITE_APP_URL から取得される Pomodoro Timer App の URL
 */

export const getAppUrl = (): string => {
  // ビルド時に CDK から注入される環境変数
  const appUrl = import.meta.env.VITE_APP_URL;
  
  if (!appUrl) {
    console.warn('VITE_APP_URL environment variable is not set. Using fallback URL.');
    // 統合アプリ内の /app ルートに遷移
    return '/app';
  }
  
  return appUrl;
};

// デバッグ用
export const logAppUrl = () => {
  console.log('App URL:', getAppUrl());
  console.log('Environment:', import.meta.env.MODE);
};