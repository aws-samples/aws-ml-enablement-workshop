# MLEW Tracker SDK

Webサイトのユーザー行動を追跡するJavaScript SDK。

## インストール

### CDN経由

```html
<script src="https://your-cdn-url/tracker-sdk.js"></script>
```

### npm経由

```bash
npm install @mlew/tracker
```

## 基本的な使用方法

```javascript
// トラッカーの初期化
const tracker = new MLEWTracker.Tracker({
  applicationId: 'my-app',
  applicationName: 'My Application',
  apiEndpoint: 'https://api.example.com/dev/',
  apiKey: 'YOUR_API_KEY',
  autoTrack: true,  // 自動追跡を有効化
  debug: false      // 本番環境ではfalse
});

// ユーザーIDの設定（オプション）
tracker.setUserId('user-123');

// 手動でイベントを送信
tracker.trackClick('button-name', {
  section: 'hero',
  action: 'signup'
});

tracker.trackView('page-name', {
  section: 'products',
  category: 'electronics'
});
```

## 自動追跡

HTML要素に`data-track`属性を追加すると自動的に追跡されます：

```html
<button data-track="true" data-track-name="cta-button">
  Click Me
</button>

<a href="/about" data-track="true" data-track-name="nav-about">
  About
</a>
```

## 設定オプション

| オプション | 型 | デフォルト | 説明 |
|-----------|-----|-----------|------|
| applicationId | string | 必須 | アプリケーションの識別子 |
| applicationName | string | 必須 | アプリケーション名 |
| apiEndpoint | string | 必須 | API エンドポイントURL |
| apiKey | string | 必須 | API認証キー |
| autoTrack | boolean | true | 自動追跡の有効/無効 |
| debug | boolean | false | デバッグモードの有効/無効 |
| flushInterval | number | 10000 | イベント送信間隔（ミリ秒） |
| maxQueueSize | number | 50 | キューの最大サイズ |

## APIメソッド

### trackClick(elementName, properties?)
クリックイベントを追跡

### trackView(pageName, properties?)
ページビューイベントを追跡

### setUserId(userId)
ユーザーIDを設定

### flush()
キューに溜まったイベントを即座に送信

### disable()
追跡を一時停止

### enable()
追跡を再開

## TypeScript サポート

TypeScript定義ファイルが含まれています。

```typescript
import { Tracker } from '@mlew/tracker';

const tracker = new Tracker({
  // 設定
});
```

## ブラウザサポート

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## ライセンス

MIT