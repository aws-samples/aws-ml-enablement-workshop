# MLEW Tracker 導入ガイド

モックに MLEW Tracker の計測を組み込む方法です。Tracker の値（API Endpoint / API Key）を受け取っている場合だけ行います。パスは、表で `yourwork/` と書いたもの以外は Nx ワークスペース（`yourwork/product/`）からの相対です。

このガイドが扱うのは計測だけです。ワークスペースの生成、デプロイと再デプロイ、リージョン、削除は [デプロイメントガイド](/yourwork/template/DEPLOYMENT_GUIDE.md) に従います。

## 守ること

- **`template/` にある公式の `tracker-sdk.js` と `mlewTracker.ts` をそのまま使います。** SDK を自作したり、ほかの URL や npm から読み込んだり、Tracker の API を `fetch` などで直接呼んだりしません。自作すると画面上は動いて見えても、イベントは Tracker に届きません。
- **固定ファイルは編集しません。** 生成されたファイルに書くのは、下の「接続コード」だけです。
- **CSP は生成物の既定値のまま使います。** SDK はモックと同じオリジン（`/tracker-sdk.js`）から配信され、送信先の API は既定の `connect-src` が許可する https なので、CSP を変える必要はありません。インライン script は CSP で実行されないので使いません。

## 必要な値

Tracker のデプロイ完了通知メールで受け取る次の 3 つです（取り直し方は [当日のガイド](/yourwork/README.md) の「2. Tracker システムのデプロイ」）。

| 値 | 使い道 |
| --- | --- |
| API Endpoint | `config.ts` の `tracker.apiEndpoint`。例: `https://xxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/dev` |
| API Key | `config.ts` の `tracker.apiKey` |
| Dashboard URL | 計測結果を見るダッシュボード。モックには組み込みません |

Tracker はモックと別のリージョンにあっても構いません。API Endpoint の URL で指定するだけです。

## 固定ファイル

次の 2 つを、内容を変えずにコピーします（コピー先のディレクトリが無ければ作ります）。

| コピー元（`yourwork/` から） | コピー先（`product/` から） | 役割 |
| --- | --- | --- |
| `template/website/public/tracker-sdk.js` | `packages/website/public/tracker-sdk.js` | Tracker SDK（ビルド済み）。`window.MLEWTracker` を定義する |
| `template/website/src/services/mlewTracker.ts` | `packages/website/src/services/mlewTracker.ts` | SDK の初期化と計測の関数 |

どちらも生成物の Biome と strict な TypeScript の設定で build が通ることを確認済みです。

`mlewTracker.ts` は、SDK の次の挙動に対処しています。モックの側で同じ対処を書き足す必要はありません。

- 初回ページビューの userId が空になる → ブラウザごとの匿名 ID を、SDK の生成前に保存しておく
- Link のクリックが遷移先のページで記録される → クリック時点（遷移前）のパスを記録する
- Link による画面遷移でページビューが記録されない → router の history を購読して記録する（戻る・進むは SDK が記録する）

あわせて、`apiEndpoint` / `apiKey` が空なら送信せずにコンソールへエラーを出し、`apiEndpoint` の末尾の `/` は除きます。

`mlewTracker.ts` が export する関数は次のとおりです。

| 関数 | 用途 |
| --- | --- |
| `initTracker(config, history)` | SDK を初期化し、ルート遷移のページビューを記録する。`main.tsx` で 1 回だけ呼ぶ |
| `trackClick(elementName, properties?)` | `data-track` を付けられない操作のクリックを記録する。`data-track` を付けた要素（とその子孫）の handler では呼ばない |
| `trackSectionView(sectionName, properties?)` | セクションの表示を custom イベント（`section-view`）で記録する。同じページでは 1 セクション 1 回 |
| `observeSection(element, sectionName, threshold?)` | 要素が画面に入ったら `trackSectionView` を 1 回呼ぶ。戻り値は監視の解除 |

## 接続コード

生成されたファイルに、次の 3 か所だけを書きます。

### `packages/website/index.html`

`<head>` の中に SDK の script タグを置きます。`async` / `defer` は付けません（`main.tsx` より先に `window.MLEWTracker` を定義させるため）。

```html
    <script src="/tracker-sdk.js"></script>
```

### `packages/website/src/config.ts`

生成された `export default { ... }` に `tracker` ブロックを足します。値は受け取ったものに置き換えます。

```ts
  tracker: {
    applicationId: 'your-app-id', // 製品名に基づいて付ける（英小文字と -）
    applicationName: 'あなたのアプリ名',
    apiEndpoint:
      'https://xxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/dev',
    apiKey: 'xxxxxxxx',
  },
```

### `packages/website/src/main.tsx`

import を 2 行足し、生成された `createRouter` の直後で `initTracker` を呼びます。`createRouter` の行は生成されたものをそのまま使います。

```ts
import Config from './config';
import { initTracker } from './services/mlewTracker';

// 生成された const router = createRouter({ ... }); の直後
initTracker({ ...Config.tracker, debug: import.meta.env.DEV }, router.history);
```

書いたあとに build が Biome の整形で失敗したら、`pnpm lint` で整形します。

## 命名規約

`data-track-name` は、版（v1 / v2 など）をまたいで同じ操作を同じ名前で比べるために、次の規約で付けます。

- **形式は `<画面>-<領域>-<対象>-<種類>` の kebab-case（英小文字・数字・`-`）です。**
  - `<画面>`: ルートから決めます。`/` は `lp`、`/app` は `app`、`/app/search` は `app-search`、404 は `not-found`
  - `<領域>`: `header` / `sidebar` / `breadcrumb` / `hero` / `footer` など、画面の中の場所
  - `<対象>`: 操作の意味（`signup`、`home`、`search` など）。表示文言の翻訳や連番ではなく、役割で名付けます
  - `<種類>`: `button` / `link` / `tab` / `toggle` など、要素の種類
  - 例: `lp-hero-signup-button`、`app-sidebar-home-link`、`app-search-form-submit-button`、`not-found-main-home-link`
- **`data-track="true"` と対で付けます。** SDK は `data-track="true"` の要素だけを記録します。
- **フォームは `<form>` ではなく送信ボタンに付けます。** `<form>` に付けると、フォーム内のクリック（入力欄やラベルなど）がすべて記録され、送信していなくても数が増えます。
- `trackClick` の `elementName` も同じ規約で付けます。`trackSectionView` / `observeSection` の `sectionName` は `<画面>-<セクション>`（例: `lp-features`）です。
- クリック以外の出来事（完了・結果の表示など）は `trackClick` で送りません。結果の画面やセクションが表示されたことを `observeSection` / `trackSectionView` で記録します。名前は上と同じ `<画面>-<セクション>` で、表示されたセクションの名前にします（例: 登録の完了は `app-signup-result`）。イベントの種類は `section-view` なので、名前に `-view` や `-completed` は付けません。
- 同じ画面の同じ役割の要素には、版が変わっても同じ名前を使います。

## 計測対象

- すべての CTA、すべてのナビゲーションリンク（ヘッダー・サイドバー・パンくず・フッター・404 ページのトップへ戻るリンクを含む）、すべてのフォーム送信（送信ボタン）に `data-track="true"` と `data-track-name` を付けます。開閉ボタンなどの UI 操作にも付けて構いません。
- 1 つの要素は `data-track` か `trackClick` のどちらか一方で計測します。両方を使うと二重に記録されます。`trackClick` は `data-track` を付けられない操作だけに使います。
- LP の主要なセクション（ヒーロー、特徴、料金、FAQ など）の表示を `observeSection` で記録します。React では `useEffect` の中で要素に対して呼び、戻り値を cleanup として返します。セクション表示はページビューとして送りません。
- 画面遷移は TanStack Router の `Link` で行います。`<a href>` は全ページを再読み込みします。
- ページビューは固定ファイルが記録するので、各画面の `useEffect` などで送りません。

## 確認

- 二重計測が無いことは、`trackClick(` の呼び出し箇所を検索し、どれも `data-track` を付けた要素（とその子孫）の handler の中に無いことで確かめます。
- `pnpm dev` では `debug: import.meta.env.DEV` により、SDK のログがブラウザのコンソールに出ます。
- SDK は 5 秒ごと、10 件たまったとき、ページを離れるときにまとめて `<API Endpoint>/v1/events` へ送ります。
- 完了の確認方法（デプロイ後の URL での確認を含む）は `prompt/prompt.md` の完了条件に従います。

| 症状 | 原因と対処 |
| --- | --- |
| コンソールに `[MLEW Tracker] SDK が読み込まれていません` | `index.html` の `<head>` に script タグが無いか、`async` / `defer` が付いている。`packages/website/public/tracker-sdk.js` があるかも確認する |
| コンソールに `tracker.apiEndpoint / tracker.apiKey が空` | `config.ts` の `tracker` ブロックに値を入れる |
| CORS エラーや 403 が出る | API Key が誤っている。受け取った値と `config.ts` を見比べる |
| 値を直したのにデプロイ先に反映されない | 再デプロイする（手順はデプロイメントガイド） |
