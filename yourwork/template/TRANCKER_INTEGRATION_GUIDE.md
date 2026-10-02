# MLEW Tracker 導入ガイド

パスは Nx ワークスペース（`yourwork/product/`）からの相対です。

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

モックは CloudFront の CSP（`script-src 'self'` + SDK のオリジン）の下で配信されます。**インライン script は実行されない**ため、SDK の読み込みは `index.html`、初期化はバンドルされる TypeScript で行います。

```html
<!-- packages/website/index.html の <head> 内: 外部SDKを読み込む（必須） -->
<script src="https://{ダミーURL}.cloudfront.net/tracker-sdk.js"></script>
```

```ts
// packages/website/src/main.tsx: SDKが提供するTrackerクラスで初期化する
import { initTracker, trackView } from './services/mlewTracker';

initTracker();
```

`initTracker` の中身は下の「React/TypeScript サービス層の実装」の `mlewTracker.ts` です。

## 必要な情報
担当者から以下の情報を受取ってください（Tracker デプロイ完了通知に記載されています）。
- **SDK URL**: 「Tracker SDK URL」の値。`https://{ダミーURL}.cloudfront.net/tracker-sdk.js`（外部CDN必須）
  - ⚠️ **Dashboard URL のドメインではありません**。SDK 配信用の CloudFront です
- **API Endpoint**: `https://api123456.execute-api.us-west-2.amazonaws.com/dev/`
- **API Key**: 認証キー（例: `YOUR_TRACKER_API_KEY`）

## 基本セットアップ

### 実装手順

#### ステップ1: `packages/website/index.html` の `<head>` で外部SDKを読み込む
```html
<head>
    <!-- 他のheadタグ要素 -->

    <!-- 🚨 重要: 必ず外部SDKを読み込む。async / defer は付けない（バンドルより先に読ませる） -->
    <script src="https://{ダミーURL}.cloudfront.net/tracker-sdk.js"></script>
</head>
```

#### ステップ2: CSP の `script-src` に SDK のオリジンを追加する
`packages/infra/src/stacks/application-stack.ts` の `TRACKER_SDK_ORIGIN` に SDK URL の**スキーム+ホスト**（例 `https://xxxxxxxx.cloudfront.net`、パスなし）を書き、`new Website(this, 'Website', { scriptSrc: [TRACKER_SDK_ORIGIN] })` で渡します。あとから追加・変更した場合は `pnpm nx deploy-sandbox infra` を再実行します。

> CSP は CloudFront のレスポンスヘッダーで付くため、`pnpm dev` では問題が出ず、デプロイ後に初めてブロックされます。

#### ステップ3: 接続情報を `packages/website/src/config.ts` に書く
生成された `config.ts` に `tracker` を追加します。

```ts
export default {
  // ...生成された項目
  tracker: {
    applicationId: 'your-app-name',
    applicationName: 'Your Application Name',
    apiEndpoint: 'https://api123456.execute-api.us-west-2.amazonaws.com/dev/',
    apiKey: 'YOUR_TRACKER_API_KEY',
  },
};
```

#### ステップ4: `packages/website/src/services/mlewTracker.ts` を作り、`main.tsx` で初期化する
`mlewTracker.ts` は「React/TypeScript サービス層の実装」のコードをそのまま使います。`packages/website/src/main.tsx` には次を足します（`createRouter` は生成済みの行を置き換え）。

```ts
import { initTracker, trackView } from './services/mlewTracker';

initTracker();

const router = createRouter({ routeTree, context: {} });

let lastPath = window.location.pathname;
router.history.subscribe(({ location, action }) => {
  if (location.pathname === lastPath) return;
  lastPath = location.pathname;
  if (action.type === 'PUSH' || action.type === 'REPLACE') {
    trackView(location.pathname);
  }
});
```

`router.history.subscribe` が必要な理由は「SDK の既知の挙動と対処」の 1 を参照してください。

#### 実装時の注意事項
1. **必ず外部SDK URLを使用**: 自作実装は禁止
2. **読み込み順序を守る**: `<head>` の SDK（async / defer なし）→ `main.tsx` の `initTracker()`
3. **SDKの存在確認**: `window.MLEWTracker`の存在を確認してから初期化（`initTracker` が行う）
4. **エラーハンドリング**: SDKが読み込まれない場合のエラー表示（`initTracker` が行う）
5. **インライン script で初期化しない**: CSP で実行されません

#### 参考: CSP の無い環境（素の HTML など）
CSP の無いサイトに限り、`</body>` 直前のインライン script で初期化できます。モック（Nx 版）では使えません。

```html
<script>
  if (window.MLEWTracker) {
    const visitorId = getVisitorId(); // mlewTracker.ts の getVisitorId と同じ処理
    localStorage.setItem('mlew_tracker_userId', visitorId); // SDK 生成前に書く（下記の既知の挙動 3）
    window.tracker = new window.MLEWTracker.Tracker({ /* config.ts の tracker と同じ値 */ autoTrack: true });
    window.tracker.setUserId(visitorId);
  }
</script>
```

## クリック追跡

計測したい要素に `data-track="true"` と `data-track-name` を付けます。SDK は親要素をたどって `data-track` を探すので、リンク内のアイコンや文字をクリックしても記録されます。

**計測対象**: すべての CTA、すべてのナビゲーションリンク（ヘッダー・サイドバー・パンくず・フッター・404 ページのトップへ戻るリンクを含む）、すべてのフォーム送信。開閉ボタン等の UI 操作にも付けてかまいません。

```tsx
import { Link } from '@tanstack/react-router';

{/* ボタン */}
<button data-track="true" data-track-name="purchase-button">
    購入する
</button>

{/* リンク（TanStack Router の Link。<a href> は全ページ再読込になる） */}
<Link to="/contact" data-track="true" data-track-name="contact-link">
    お問い合わせ
</Link>

{/* フォーム（送信時に form-submit として記録される） */}
<form data-track="true" data-track-name="signup-form">
    <input type="email" placeholder="メールアドレス" />
    <button type="submit">登録</button>
</form>
```

## SDK の既知の挙動と対処

いずれも SDK は編集せず、`mlewTracker.ts` と `main.tsx` で対処します（Nx 固有ではなく SPA 共通の問題です）。

### 1. SPA の画面遷移でページビューが記録されない
- **症状**: 初回表示と「戻る・進む」のページビューしかダッシュボードに出ない
- **理由**: `autoTrack` のページビューは初回表示と `popstate` だけを記録する。Link による遷移（pushState）では `popstate` が発生しない
- **対処**: `main.tsx` の `router.history.subscribe` で、`PUSH` / `REPLACE` のときだけ `trackView` を呼ぶ。`BACK` / `FORWARD` は SDK が `popstate` で記録するので除外する（両方で記録すると二重になる）

### 2. Link クリックの page が遷移先のパスになる
- **症状**: 「LP の CTA」のクリックが、遷移先の画面で起きたクリックとして記録される
- **理由**: SDK はクリックの page を記録時点の `location.pathname` から取る。Link のクリックでは、記録時点で URL がすでに遷移先になっている
- **対処**: `initTracker` がキャプチャ段階のクリックリスナーで、最寄りの `[data-track="true"]` に `data-track-page` = 遷移前のパスを入れる。SDK は `data-track-*` をプロパティにして page を上書きする

### 3. 初回ページビューの userId が空になる
- **症状**: 各訪問の最初のページビューだけ userId が無い
- **理由**: SDK はコンストラクタで初回ページビューを送るため、その後の `setUserId` が間に合わない
- **対処**: SDK を生成する前に `localStorage.setItem('mlew_tracker_userId', visitorId)` を書く。SDK は起動時にこのキーから userId を復元する（`initTracker` が行う）

## ユーザーID設定

### ログイン機能がある場合
```javascript
// ログイン後にユーザーIDを設定
window.tracker?.setUserId('user-12345');  // 実際のユーザーID
```

### モック実装・ログイン機能がない場合（推奨: ブラウザごとの永続的な匿名ID）

ログイン機能がないときは、**ブラウザごとに永続する匿名ID（訪問者ID）を発行**します。`localStorage` のキー `mlew-visitor-id` に `crypto.randomUUID()` の値を保存し、2回目以降のアクセスでは保存済みの値を再利用します。`mlewTracker.ts` の `getVisitorId` がこれを行い、SDK 生成前に `mlew_tracker_userId` へ書いたうえで `setUserId` も呼びます（既知の挙動 3）。

> ⚠️ **重要**: ユーザーIDは分析の精度に影響します。
> - ログイン機能がある場合: 実際のユーザーIDを使用
> - ログイン機能がない場合: `localStorage` の `mlew-visitor-id` に保存した永続的な匿名ID（`crypto.randomUUID()`）を使用
> - `localStorage` や `crypto.randomUUID` が使えない環境: `'anonymous'` にフォールバック（その端末の利用は区別できなくなる）
> - 未設定の場合: セッションベースの追跡のみ

> ❌ **全利用者に `'anonymous'` を固定で設定しないでください**: 全員のイベントが同一IDにまとまるため、「1人あたりの利用回数」「継続率」「再訪率」といった利用者単位の指標が原理的に算出できなくなります。モックへの反応を実データで測るというワークショップの目的が果たせないので、`'anonymous'` は上記が動かない環境での最後の手段としてのみ使ってください。

## React/TypeScript サービス層の実装

### 1. TypeScript サービスファイル作成 (`packages/website/src/services/mlewTracker.ts`)

このコードをそのまま使います（`initTracker` が SDK の生成・userId の設定・`window.tracker` への代入・遷移前パスの付与まで行います）。

```ts
import Config from '../config';

type TrackerInstance = {
  trackClick: (elementName: string, properties?: Record<string, unknown>) => void;
  trackView: (pageName: string, properties?: Record<string, unknown>) => void;
  setUserId: (userId: string) => void;
};

declare global {
  interface Window {
    MLEWTracker?: { Tracker: new (config: Record<string, unknown>) => TrackerInstance };
    tracker?: TrackerInstance;
  }
}

const getVisitorId = (): string => {
  try {
    let id = localStorage.getItem('mlew-visitor-id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('mlew-visitor-id', id);
    }
    return id;
  } catch {
    return 'anonymous';
  }
};

export const initTracker = (): void => {
  if (window.tracker) return;
  if (!window.MLEWTracker) {
    console.error('MLEW Tracker SDK not loaded - 外部SDKの読み込みを確認してください');
    return;
  }
  const visitorId = getVisitorId();
  try {
    localStorage.setItem('mlew_tracker_userId', visitorId);
  } catch {
    // localStorage が使えない環境では setUserId だけで続行する
  }
  const tracker = new window.MLEWTracker.Tracker({
    ...Config.tracker, // applicationId, applicationName, apiEndpoint, apiKey
    autoTrack: true,
    debug: import.meta.env.DEV,
  });
  tracker.setUserId(visitorId);
  window.tracker = tracker;

  document.addEventListener(
    'click',
    (event) => {
      const el = (event.target as Element | null)?.closest<HTMLElement>('[data-track="true"]');
      if (el) el.dataset.trackPage = window.location.pathname;
    },
    true,
  );
};

export const trackView = (pageName: string): void => {
  window.tracker?.trackView(pageName, { title: document.title });
};

export const trackClick = (elementName: string, properties?: Record<string, unknown>): void => {
  window.tracker?.trackClick(elementName, properties);
};
```

### 2. React コンポーネントでの使用例

セクション表示の計測に `react-intersection-observer` を使う場合は、Nx の website には含まれないので `product/` で `pnpm add react-intersection-observer --filter @product/website` を実行してから使います。

```tsx
import { Link } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { trackClick, trackView } from '../services/mlewTracker';

export const MyComponent = () => {
  // セクション表示トラッキング用
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true, // 重要: 重複を防ぐため
  });

  // React Strict Mode での重複実行を防ぐ
  const hasTracked = useRef(false);

  useEffect(() => {
    if (inView && !hasTracked.current) {
      hasTracked.current = true;
      trackView('section-name');
    }
  }, [inView]);

  return (
    <section ref={ref} id="my-section">
      {/* data-track 属性を使用した自動トラッキング */}
      <Link to="/signup" data-track="true" data-track-name="hero-get-started-cta">
        Get Started
      </Link>

      {/* 手動トラッキング（data-track と併用しない） */}
      <Link
        to="/about"
        onClick={() => trackClick('nav-about', { destination: '/about', source: 'header-menu', type: 'navigation' })}
      >
        About
      </Link>
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
// 1. index.html の <head> で外部SDKを読み込む
// 2. バンドルされる TS（mlewTracker.ts）で SDK が提供する Tracker クラスを使用
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
- ❌ SDK の取り込み（ダウンロードして `public/` に置く、npm で入れる等）。必ず SDK URL から読み込む

#### 5. なぜ外部SDKが必須なのか
1. **正しいAPI仕様**: SDKのみが正確なエンドポイントを知っている
2. **認証処理**: API Keyの適切な送信方法を実装済み
3. **エラーハンドリング**: ネットワークエラーや再送処理を含む
4. **CORS対応**: サーバー側で適切に設定済み
5. **バージョン管理**: API仕様変更への自動対応

## よくある問題と解決法

### コンソールに CSP 違反が出る場合

**症状**: デプロイ後のブラウザのコンソールに次のどちらかが出る（`pnpm dev` では出ない）
- `Refused to load the script '...tracker-sdk.js'` — SDK の読み込みがブロックされた
- `Refused to execute inline script` — インライン script がブロックされた

**原因と解決**:
- `Refused to load the script`: CSP の `script-src` に SDK のオリジンが無い。`application-stack.ts` の `TRACKER_SDK_ORIGIN` に SDK URL のスキーム+ホスト（パスなし）を書いて `scriptSrc` に渡し、`pnpm nx deploy-sandbox infra` を再実行する。オリジンが index.html の SDK URL と一致しているかも確認する
- `Refused to execute inline script`: index.html のインライン script で初期化している。初期化を `mlewTracker.ts` の `initTracker()` に移し、`main.tsx` から呼ぶ

### SDK URL に Dashboard のドメインを使ってしまった場合

**症状**: `MLEW Tracker SDK not loaded` が出る、またはイベントが期待どおりに記録されない
**原因**: Tracker デプロイ完了通知の「Dashboard URL」のドメインで `tracker-sdk.js` を指定している（ダッシュボード側にあった SDK は古いビルドのコピーで、リポジトリからは削除済み。ただし削除前にデプロイした Tracker では、再デプロイするまで Dashboard のドメインから古い SDK が配信され続けます）
**解決**: 「Tracker SDK URL」（SDK 配信用 CloudFront）の値に直し、`TRACKER_SDK_ORIGIN` もそのオリジンに揃えて `pnpm nx deploy-sandbox infra` を再実行する

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
```tsx
// ❌ 悪い例: 重複する
<button
  data-track="true"
  data-track-name="cta-button"
  onClick={() => trackClick('cta-button')}  // 重複!
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

2. **ページビューを二重に記録しない**: `router.history.subscribe` で `BACK` / `FORWARD` を記録しない（SDK が `popstate` で記録する）。各画面の `useEffect` で同じページビューを送らない

3. **React Strict Mode での重複実行を防ぐ**
```tsx
const hasTracked = useRef(false);

useEffect(() => {
  if (inView && !hasTracked.current) {
    hasTracked.current = true;  // 重複防止フラグ
    trackView('section-name');
  }
}, [inView]);
```

4. **useInView で triggerOnce: true を設定**
```tsx
const [ref, inView] = useInView({
  threshold: 0.3,
  triggerOnce: true  // 重要: 一度だけ発火
});
```

### データが送信されない場合

**デバッグ方法**:
1. コンソールで `window.tracker` が存在するか確認する（無ければ下の「トラッカーが初期化されない場合」）
2. `pnpm dev` では `debug: import.meta.env.DEV` により SDK のログがコンソールに出る
3. ブラウザの開発者ツールの Network タブで `/v1/events` への POST が 200 になっているか確認する（SDK は 5 秒ごと・10 件たまったとき・ページ離脱時にまとめて送信する）

### CORSエラーが発生する場合

**原因**: API Key が未設定または不正
**解決**: `packages/website/src/config.ts` の `tracker.apiKey` に正しい API Key を設定してください

### トラッカーが初期化されない場合

**症状**: `window.tracker` が undefined、コンソールに `MLEW Tracker SDK not loaded`
**原因と解決**:
- SDK の script タグが無い、または `async` / `defer` が付いていて `main.tsx` より後に読み込まれている → `packages/website/index.html` の `<head>` に async / defer なしで書く
- CSP でブロックされている → 上の「コンソールに CSP 違反が出る場合」
- SDK URL が誤っている → 上の「SDK URL に Dashboard のドメインを使ってしまった場合」
