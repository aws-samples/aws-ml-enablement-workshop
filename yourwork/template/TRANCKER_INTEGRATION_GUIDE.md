# MLEW Tracker 導入ガイド

## 🚨 重要: 必ず外部SDKを使用してください

**絶対に自作実装しないでください**。MLEW Trackerは必ず提供された外部SDKを使用する必要があります。

### ❌ 間違った実装例（絶対に避ける）
```javascript
// これは間違いです - 自作SDKは使用禁止
window.MLEWTracker = {
  Tracker: function(config) {
    return {
      trackClick: function() { /* 自作実装 */ },
      trackView: function() { /* 自作実装 */ }
    };
  }
};
```

### ✅ 正しい実装例（必須）
```html
<!-- 外部SDKを読み込む（必須） -->
<script src="https://{ダミーURL}.cloudfront.net/tracker-sdk.js"></script>
<script>
  // SDKが提供するTrackerクラスを使用
  const tracker = new window.MLEWTracker.Tracker(config);
</script>
```

## 必要な情報
担当者から以下の情報を受取ってください。
- **SDK URL**: `https://{ダミーURL}.cloudfront.net/tracker-sdk.js`（外部CDN必須）
- **API Endpoint**: `https://api123456.execute-api.us-west-2.amazonaws.com/dev/`
- **API Key**: 認証キー（例: `abcd1234efgh5678ijkl9012mnop3456qrst7890`）

## 基本セットアップ（3分）

### 実装手順

#### ステップ1: 必ず外部SDKを読み込む
```html
<!DOCTYPE html>
<html>
<head>
    <!-- 他のheadタグ要素 -->
    
    <!-- 🚨 重要: 必ず外部SDKを先に読み込む -->
    <script src="https://{ダミーURL}.cloudfront.net/tracker-sdk.js"></script>
</head>
<body>
    <!-- サイトコンテンツ -->
    
    <!-- ステップ2: SDKの初期化（body閉じタグ直前） -->
    <script>
        // ブラウザごとに永続する匿名ID（訪問者ID）を取得する
        // 詳細は「ユーザーID設定」の節を参照
        function getVisitorId() {
            try {
                let id = localStorage.getItem('mlew-visitor-id');
                if (!id) {
                    id = crypto.randomUUID();
                    localStorage.setItem('mlew-visitor-id', id);
                }
                return id;
            } catch (e) {
                // localStorage / crypto.randomUUID が使えない環境のフォールバック
                return 'anonymous';
            }
        }

        // 🚨 重要: window.MLEWTracker.Trackerを自作実装しない
        // 外部SDKが提供するクラスを使用する
        if (typeof window !== 'undefined' && window.MLEWTracker) {
            const tracker = new window.MLEWTracker.Tracker({
                applicationId: 'your-app-name',
                applicationName: 'Your Application Name',
                apiEndpoint: 'https://api123456.execute-api.us-west-2.amazonaws.com/dev/',
                apiKey: 'abcd1234efgh5678ijkl9012mnop3456qrst7890',
                autoTrack: true,
                debug: true  // 開発環境では true に設定
            });
            
            // ユーザーID設定（推奨: 利用者単位の指標を出すために設定する）
            tracker.setUserId(getVisitorId());
            
            // グローバルにアクセス可能にする
            window.tracker = tracker;
            
            console.log('MLEW Tracker initialized successfully');
        } else {
            console.error('MLEW Tracker SDK not loaded - 外部SDKの読み込みを確認してください');
        }
    </script>
</body>
</html>
```

#### 実装時の注意事項
1. **必ず外部SDK URLを使用**: 自作実装は禁止
2. **読み込み順序を守る**: SDK → 初期化スクリプト
3. **SDKの存在確認**: `window.MLEWTracker`の存在を確認してから初期化
4. **エラーハンドリング**: SDKが読み込まれない場合のエラー表示

## クリック追跡

重要な要素に `data-track="true"` を追加する。

```html
<!-- ボタン -->
<button data-track="true" data-track-name="purchase-button">
    購入する
</button>

<!-- リンク -->
<a href="/contact" data-track="true" data-track-name="contact-link">
    お問い合わせ
</a>

<!-- フォーム -->
<form data-track="true" data-track-name="signup-form">
    <input type="email" placeholder="メールアドレス">
    <button type="submit">登録</button>
</form>
```

## ユーザーID設定

### ログイン機能がある場合
```javascript
// ログイン後にユーザーIDを設定
tracker.setUserId('user-12345');  // 実際のユーザーID
```

### モック実装・ログイン機能がない場合（推奨: ブラウザごとの永続的な匿名ID）

ログイン機能がないときは、**ブラウザごとに永続する匿名ID（訪問者ID）を発行**します。`localStorage` のキー `mlew-visitor-id` に `crypto.randomUUID()` の値を保存し、2回目以降のアクセスでは保存済みの値を再利用します。

```javascript
// ブラウザごとに永続する匿名ID（訪問者ID）を取得する
function getVisitorId() {
  try {
    let id = localStorage.getItem('mlew-visitor-id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('mlew-visitor-id', id);
    }
    return id;
  } catch (e) {
    // localStorage が使えない（プライベートブラウジング等）、
    // crypto.randomUUID が無い（HTTPS でない環境等）場合のフォールバック
    return 'anonymous';
  }
}

// 訪問者IDをユーザーIDとして設定する
tracker.setUserId(getVisitorId());
```

> ⚠️ **重要**: ユーザーIDは分析の精度に影響します。
> - ログイン機能がある場合: 実際のユーザーIDを使用
> - ログイン機能がない場合: `localStorage` の `mlew-visitor-id` に保存した永続的な匿名ID（`crypto.randomUUID()`）を使用
> - `localStorage` や `crypto.randomUUID` が使えない環境: `'anonymous'` にフォールバック（その端末の利用は区別できなくなる）
> - 未設定の場合: セッションベースの追跡のみ

> ❌ **全利用者に `'anonymous'` を固定で設定しないでください**: 全員のイベントが同一IDにまとまるため、「1人あたりの利用回数」「継続率」「再訪率」といった利用者単位の指標が原理的に算出できなくなります。モックへの反応を実データで測るというワークショップの目的が果たせないので、`'anonymous'` は上記が動かない環境での最後の手段としてのみ使ってください。

## React/TypeScript サービス層の実装

実際の実装例に基づいた TypeScript サービス層を作成します。

### 1. TypeScript サービスファイル作成 (`src/services/mlewTracker.ts`)

```typescript
// MLEW Tracker Service - 統一テンプレート用のシンプルな統合
// trackClick と trackView のみを使用（要件通り）

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
    // MLEW Tracker が利用可能になるまで待機
    if (typeof window !== 'undefined') {
      if (window.tracker) {
        this.isReady = true;
        this.flushPendingEvents();
      } else {
        // 5秒間、100msごとにチェック
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
   * ボタン、リンク、その他のインタラクティブ要素のクリックイベントを追跡
   */
  trackClick(elementName: string, properties?: TrackingProperties) {
    if (this.isReady && window.tracker) {
      window.tracker.trackClick(elementName, properties);
      console.log('[MLEW Tracker] Click tracked:', elementName, properties);
    } else {
      // トラッカーが準備できていない場合はキューに保存
      this.pendingEvents.push({ type: 'click', name: elementName, properties });
      console.log('[MLEW Tracker] Click queued:', elementName, properties);
    }
  }

  /**
   * ページやセクションのビューイベントを追跡
   */
  trackView(pageName: string, properties?: TrackingProperties) {
    if (this.isReady && window.tracker) {
      window.tracker.trackView(pageName, properties);
      console.log('[MLEW Tracker] View tracked:', pageName, properties);
    } else {
      // トラッカーが準備できていない場合はキューに保存
      this.pendingEvents.push({ type: 'view', name: pageName, properties });
      console.log('[MLEW Tracker] View queued:', pageName, properties);
    }
  }

  /**
   * ナビゲーションクリック用の便利メソッド
   */
  trackNavigation(linkName: string, destination: string, source: string) {
    this.trackClick(`nav-${linkName}`, {
      destination,
      source,
      type: 'navigation'
    });
  }

  /**
   * CTAボタンクリック用の便利メソッド
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
   * フォーム送信用の便利メソッド
   */
  trackFormSubmit(formName: string, source: string) {
    this.trackClick(`form-${formName}`, {
      formName,
      source,
      type: 'form-submit'
    });
  }

  /**
   * ページビュー用の便利メソッド
   */
  trackPageView(pageName: string, section?: string) {
    this.trackView(pageName, {
      ...(section && { section }),
      url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: Date.now()
    });
  }

  /**
   * トラッカー準備状況チェック
   */
  isTrackerReady(): boolean {
    return this.isReady;
  }

  /**
   * 待機中イベント数取得（デバッグ用）
   */
  getPendingEventsCount(): number {
    return this.pendingEvents.length;
  }
}

// シングルトンインスタンスをエクスポート
export const mlewTracker = new MLEWTrackerService();

// 便利のためのデフォルトエクスポート
export default mlewTracker;
```

### 2. React コンポーネントでの使用例

```typescript
import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { mlewTracker } from '../services/mlewTracker';

const MyComponent: React.FC = () => {
  // セクション表示トラッキング用
  const [ref, inView] = useInView({ 
    threshold: 0.3,
    triggerOnce: true  // 重要: 重複を防ぐため
  });

  // React Strict Mode での重複実行を防ぐ
  const hasTracked = useRef(false);

  useEffect(() => {
    if (inView && !hasTracked.current) {
      hasTracked.current = true;
      mlewTracker.trackView('section-name', { 
        section: 'section-name', 
        timestamp: Date.now() 
      });
    }
  }, [inView]);

  const handleCTAClick = () => {
    mlewTracker.trackCTAClick('Get Started', 'hero-section', '/signup');
  };

  const handleNavClick = (name: string, href: string) => {
    mlewTracker.trackNavigation(name.toLowerCase(), href, 'header-menu');
  };

  return (
    <section ref={ref} id="my-section">
      {/* data-track 属性を使用した自動トラッキング */}
      <button 
        data-track="true"
        data-track-name="hero-get-started-cta"
        onClick={handleCTAClick}
      >
        Get Started
      </button>
      
      {/* 手動トラッキング（data-track と併用しない） */}
      <a href="/about" onClick={() => handleNavClick('about', '/about')}>
        About
      </a>
    </section>
  );
};
```

## 🚨 重要な実装ルール

### 絶対に守るべき実装原則

#### 1. 外部SDKの使用（必須）
```html
<!-- ✅ 正しい: 外部SDKを使用 -->
<script src="https://{ダミーURL}.cloudfront.net/tracker-sdk.js"></script>

<!-- ❌ 間違い: 自作実装は禁止 -->
<script>
window.MLEWTracker = { /* 自作実装 */ };  // これは絶対にしない
</script>
```

#### 2. 直接API呼び出しの禁止
```javascript
// ❌ 間違い: 直接APIを呼び出さない
fetch('https://api.example.com/track', {
  method: 'POST',
  body: JSON.stringify(data)
}); // これは絶対にしない

// ✅ 正しい: SDKのメソッドを使用
window.tracker.trackClick('button-name', properties);
```

#### 3. 正しい実装パターン
```javascript
// ✅ 正しい実装の流れ
// 1. 外部SDKが読み込まれるまで待機
// 2. SDKが提供するTrackerクラスを使用
// 3. SDKに全てのAPI通信を委任

if (window.MLEWTracker) {
  const tracker = new window.MLEWTracker.Tracker(config);
  // SDKが内部でAPI通信を適切に処理
  tracker.trackClick('element-name');
}
```

#### 4. 禁止事項
- ❌ `window.MLEWTracker`の自作実装
- ❌ 直接API呼び出し（fetch, XMLHttpRequest等）
- ❌ `/track`等の推測エンドポイント使用
- ❌ 独自のCORS対応実装
- ❌ 画像タグやフォームを使った迂回送信

#### 5. なぜ外部SDKが必須なのか
1. **正しいAPI仕様**: SDKのみが正確なエンドポイントを知っている
2. **認証処理**: API Keyの適切な送信方法を実装済み
3. **エラーハンドリング**: ネットワークエラーや再送処理を含む
4. **CORS対応**: サーバー側で適切に設定済み
5. **バージョン管理**: API仕様変更への自動対応

## よくある問題と解決法

### 403 Forbidden エラーが発生する場合

**原因**: 自作実装で間違ったエンドポイントやAPI仕様を使用
**解決**: 必ず外部SDKを使用し、直接API呼び出しを削除

```javascript
// ❌ これが403エラーの原因
fetch(apiEndpoint + '/track', { /* 間違った実装 */ });

// ✅ 正しい解決方法
window.tracker.trackClick('element-name', properties);
```

### 重複イベントが大量に送信される場合

**原因**: 複数のトラッキングシステムや設定ミス  
**解決策**:

1. **data-track 属性と手動トラッキングの併用を避ける**
```typescript
// ❌ 悪い例: 重複する
<button 
  data-track="true" 
  data-track-name="cta-button"
  onClick={() => mlewTracker.trackClick('cta-button')}  // 重複!
>
  Click Me
</button>

// ✅ 良い例: どちらか一方を使用
<button 
  data-track="true" 
  data-track-name="cta-button"
  onClick={handleClick}
>
  Click Me
</button>
```

2. **React Strict Mode での重複実行を防ぐ**
```typescript
const hasTracked = useRef(false);

useEffect(() => {
  if (inView && !hasTracked.current) {
    hasTracked.current = true;  // 重複防止フラグ
    mlewTracker.trackView('section-name');
  }
}, [inView]);
```

3. **useInView で triggerOnce: true を設定**
```typescript
const [ref, inView] = useInView({ 
  threshold: 0.3,
  triggerOnce: true  // 重要: 一度だけ発火
});
```

### データが送信されない場合

**デバッグ方法**:
```javascript
// 1. コンソールでトラッカー状態確認
console.log('Tracker ready:', mlewTracker.isTrackerReady());
console.log('Pending events:', mlewTracker.getPendingEventsCount());

// 2. 初期化設定でデバッグモード有効化
const tracker = new window.MLEWTracker.Tracker({
    // ... 他の設定 ...
    debug: true  // コンソールログでデバッグ
});
```

### CORSエラーが発生する場合

**原因**: API Key が未設定または不正  
**解決**: 正しい API Key を設定してください

```html
<script>
const tracker = new window.MLEWTracker.Tracker({
    // ...
    apiKey: 'あなたの正しいAPIキー',  // 必須
    // ...
});
</script>
```

### トラッカーが初期化されない場合

**症状**: `window.tracker` が undefined  
**原因**: SDK の読み込みタイミング問題

**解決策**:
```typescript
// mlewTracker.ts のサービス層が自動的に待機・再試行します
// 5秒間、100msごとにチェックし、利用可能になると自動接続されます
```
