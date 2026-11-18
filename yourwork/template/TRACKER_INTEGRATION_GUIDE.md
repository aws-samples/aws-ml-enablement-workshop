# MLEW Tracker 導入ガイド

モックに MLEW Tracker の計測を組み込む方法です。Tracker は、モックのスタックに含まれる CloudWatch RUM の app monitor に、ページビュー・クリック・セクションの表示を送り、CloudWatch Logs に保存します。記録の集計は [分析ガイド](/yourwork/template/ANALYTICS_GUIDE.md) で行います。パスは、表で `yourwork/` と書いたもの以外は Nx ワークスペース（`yourwork/product/`）からの相対です。

このガイドが扱うのは計測だけです。ワークスペースの生成、デプロイと再デプロイ、リージョン、削除は [デプロイメントガイド](/yourwork/template/DEPLOYMENT_GUIDE.md) に従います。

## 守ること

- **`template/` にある 2 つの固定ファイルをそのまま使います。** 計測のコードを自作したり、ほかの方法で CloudWatch RUM に送ったりしません。名前と送り方がそろっていないと、[分析ガイド](/yourwork/template/ANALYTICS_GUIDE.md) のクエリで集計できません。
- **固定ファイルは編集しません。** 生成されたファイルに書くのは、下の「接続コード」だけです。
- **CSP は生成物の既定値のまま使います。** 送信先（`https://dataplane.rum.<リージョン>.amazonaws.com`）は既定の `connect-src` が許可する https で、計測のコードはモックの bundle に含まれるので、CSP を変える必要はありません。
- **受け取る値はありません。** 送信先の app monitor はモックと一緒にデプロイされ、その ID はデプロイ時に `runtime-config.json` へ書かれます。設定ファイルに ID やキーを書く必要はありません。

## 固定ファイル

次の 2 つを、内容を変えずにコピーします（コピー先のディレクトリが無ければ作ります）。infra 側は [デプロイメントガイド](/yourwork/template/DEPLOYMENT_GUIDE.md) の手順 6 で、website 側は手順 7 でコピーします。

| コピー元（`yourwork/` から） | コピー先（`product/` から） | 役割 |
| --- | --- | --- |
| `template/infra/src/constructs/mlew-tracker.ts` | `packages/infra/src/constructs/mlew-tracker.ts` | CloudWatch RUM の app monitor を作り、その ID とリージョンを `runtime-config.json` に書く CDK コンストラクト |
| `template/website/src/services/mlewTracker.ts` | `packages/website/src/services/mlewTracker.ts` | `runtime-config.json` を読んで計測を始め、ページビュー・クリック・セクションの表示を送る |

どちらも生成物の Biome と strict な TypeScript の設定で build が通り、infra の checkov も通ることを確認済みです。

`mlewTracker.ts` が使う CloudWatch RUM の Web クライアントを、`product/` で website に追加します。

```
pnpm add @aws-rum/web-slim@3.2.1 --filter @product/website
```

`mlewTracker.ts` は次のことを自動で行います。モックの側で同じことを書き足す必要はありません。

- 初回表示、`Link` による画面遷移、ブラウザの戻る・進むのページビューを記録する（router の history を購読する）
- `data-track-name` を付けた要素のクリックを、クリックした時点（遷移前）の画面のパスと一緒に記録する
- `data-track-section` を付けた要素が画面に入ったら、ページごとに 1 回記録する（あとから描画された要素も対象）
- ブラウザごとの匿名の ID と、訪問（セッション）の ID を付ける。認証情報は使わない
- `runtime-config.json` に設定が無いとき（デプロイ前の `pnpm dev` など）は、送信せずにコンソールへ警告を出す

`mlewTracker.ts` が export する関数は次の 2 つです。

| 関数 | 用途 |
| --- | --- |
| `initTracker(history, options?)` | 計測を始める。`main.tsx` で 1 回だけ呼ぶ。`options.version` はモックの版（既定は `v1`）、`options.debug` は記録した内容をコンソールに出すかどうか |
| `trackAction(actionName, properties?)` | クリック以外の操作（ドラッグ＆ドロップ、選択の変更、キー操作など）を記録する。クリックの handler では呼ばない |

## 接続コード

生成されたファイルに書くのは、次の 2 か所だけです。

### `packages/infra/src/stacks/application-stack.ts`

[デプロイメントガイド](/yourwork/template/DEPLOYMENT_GUIDE.md) の手順 6 のコードに含まれています（`Website` を変数に受け、その `cloudFrontDistribution` を `MlewTracker` に渡す）。手順 6 のとおりなら、書き足すものはありません。

### `packages/website/src/main.tsx`

import を 1 行足し、生成された `createRouter` の直後で `initTracker` を呼びます。`createRouter` の行は生成されたものをそのまま使います。

```ts
import { initTracker } from './services/mlewTracker';

// 生成された const router = createRouter({ ... }); の直後
initTracker(router.history, { debug: import.meta.env.DEV });
```

2 版目以降のモック（v2 など）をデプロイするときは、`{ version: 'v2', debug: import.meta.env.DEV }` のように版を渡します。

書いたあとに build が Biome の整形で失敗したら、`pnpm lint` で整形します。

## 命名規約

`data-track-name` は、版（v1 / v2 など）をまたいで同じ操作を同じ名前で比べるために、次の規約で付けます。

- **形式は `<画面>-<領域>-<対象>-<種類>` の kebab-case（英小文字・数字・`-`）です。**
  - `<画面>`: ルートから決めます。`/` は `lp`、`/app` は `app`、`/app/search` は `app-search`、404 は `not-found`
  - `<領域>`: `header` / `sidebar` / `breadcrumb` / `hero` / `footer` など、画面の中の場所
  - `<対象>`: 操作の意味（`signup`、`home`、`search` など）。表示文言の翻訳や連番ではなく、役割で名付けます
  - `<種類>`: `button` / `link` / `tab` / `toggle` など、要素の種類
  - 例: `lp-hero-signup-button`、`app-sidebar-home-link`、`app-search-form-submit-button`、`not-found-main-home-link`
- **フォームは `<form>` ではなく送信ボタンに付けます。** `<form>` に付けると、フォーム内のクリック（入力欄やラベルなど）がすべて記録され、送信していなくても数が増えます。
- `trackAction` の `actionName` も同じ規約で、`<種類>` に操作の種類（`drag` / `drop` / `select` など）を入れます（例: `app-board-card-drop`、`lp-pricing-plan-select`）。
- `data-track-section` は `<画面>-<セクション>` です（例: `lp-features`）。
- クリック以外の出来事（完了・結果の表示など）は、結果の画面やセクションに `data-track-section` を付けて、表示されたことを記録します。名前は表示されたセクションの名前にします（例: 登録の完了は `app-signup-result`）。記録の種類が「セクションの表示」なので、名前に `-view` や `-completed` は付けません。
- 同じ画面の同じ役割の要素には、版が変わっても同じ名前を使います。
- 動的に作る名前（パンくずやリストの項目など）も、表示文言ではなく route のパスなど固定の識別子から作ります。使うのは英小文字・数字・`-` だけで、`<画面>` の部分はその要素がある実際の画面にします（例: `/app/search` のパンくずの「ホーム」は `app-search-breadcrumb-home-link`）。

## 計測対象

- すべての CTA、すべてのナビゲーションリンク（ヘッダー・サイドバー・パンくず・フッター・404 ページのトップへ戻るリンクを含む）、すべてのフォーム送信（送信ボタン）に `data-track-name` を付けます。開閉ボタンなどの UI 操作にも付けて構いません。TanStack Router の `Link` にもそのまま付けられます。
- `data-track-name` を付けた要素が入れ子になっているときは、クリックした位置にいちばん近い要素の名前が 1 回だけ記録されます。
- クリック以外の操作のうち、PR/FAQ の検証に効くもの（主要な操作のドラッグ＆ドロップなど）は `trackAction` で記録します。クリックは `data-track-name` だけで記録し、クリックの handler（`onClick`）では `trackAction` を呼びません。呼ぶと二重に記録されます。
- LP の主要なセクション（ヒーロー、特徴、料金、FAQ など）と、結果・完了の表示に `data-track-section` を付けます。
- 画面遷移は TanStack Router の `Link` で行います。`<a href>` は全ページを再読み込みします。
- ページビューは固定ファイルが記録するので、各画面の `useEffect` などで送りません。

## 確認

- 命名規約に従っていることは、モックのソースから `data-track-name` / `data-track-section` の値と `trackAction(` の第 1 引数の一覧を出し、すべてが `^[a-z0-9-]+$` に合うことで確かめます。動的に作る名前は、作り方が固定の識別子からになっているかをコードで確かめます。
- 二重計測が無いことは、`trackAction(` の呼び出し箇所を検索し、どれも `onClick` の handler の中に無いことで確かめます。
- 計測の設定が配信されていることは、デプロイ後に `curl -s <URL>/runtime-config.json` の出力に `"mlewTracker"` と `"appMonitorId"` が含まれることで確かめます（PowerShell では `curl.exe`）。
- app monitor がイベントを受け付けて保存することは、デプロイ後に、アプリのコードとは別の検証用のイベントを 1 件送り、[分析ガイド](/yourwork/template/ANALYTICS_GUIDE.md) のクエリで見つかることで確かめます。
  1. `curl -s <URL>/runtime-config.json` の出力から `appMonitorId` と `region` を控えます。`<URL>` の `https://` を除いた部分（`xxxx.cloudfront.net`）が CloudFront のドメインです。
  2. ID と時刻は推測で書かず、コマンドの出力から入れます。`node -e "for (let i = 0; i < 4; i++) console.log(crypto.randomUUID()); console.log(Math.floor(Date.now() / 1000))"` を実行すると、UUID 4 つと現在の UNIX 時刻（秒）が出ます。
  3. 本文は、エージェントのファイル書き込みで `construction/verification-event.json` に作ります（シェルの引用符の違いを避けるため）。`<...>` を 1 と 2 の値に置き換えます。`metadata` と `details` は JSON を文字列にしたもの（`\"` を含む文字列）なので、このとおりに書きます。
     ```json
     {"BatchId":"<UUID 1>","AppMonitorDetails":{"id":"<appMonitorId>","version":"verification"},"UserDetails":{"userId":"<UUID 2>","sessionId":"<UUID 3>"},"RumEvents":[{"id":"<UUID 4>","timestamp":<UNIX 時刻（秒）>,"type":"mlew.verification","metadata":"{\"domain\":\"<CloudFront のドメイン>\",\"pageId\":\"/\",\"version\":\"1.0.0\"}","details":"{\"verification\":true}"}]}
     ```
  4. 送信は `product/` で、1 行の `curl -s -i -X POST "https://dataplane.rum.<region>.amazonaws.com/appmonitors/<appMonitorId>" -H "Content-Type: application/json" --data-binary "@construction/verification-event.json"` を実行し、`200` が返ることを確かめます（PowerShell では `curl.exe`）。`400` なら、本文のメッセージ（UUID の形式など）に従って直します。
  5. **`200` だけでは保存された証拠になりません。** `metadata` の `domain` がモックのドメインと違うと、`200` が返っても記録は黙って捨てられます。送ってから 2 分ほど待ち、[分析ガイド](/yourwork/template/ANALYTICS_GUIDE.md) の手順でロググループを特定して、クエリ `filter application_version = "verification" | fields @timestamp, event_type, metadata.domain` を実行し、`event_type` が `mlew.verification` の行が出ることを確かめます。出なければ、3 の `domain` を確かめて送り直します。
  6. 検証用のイベントは `application_version` が `verification` なので、分析では自動で除かれます。
- `pnpm dev` では `debug: import.meta.env.DEV` により、記録した内容がブラウザのコンソールに `[MLEW Tracker]` 付きで出ます。デプロイ前は `runtime-config.json` が無いので、送信はせず警告が 1 回出ます。
- 記録は数秒ごとと、ページを離れるときにまとめて送られ、送ってから 2 分ほどで分析のクエリで見つかるようになります。
- 完了の確認方法（デプロイ後の URL での確認を含む）は `prompt/prompt.md` の完了条件に従います。

| 症状 | 原因と対処 |
| --- | --- |
| コンソールに `[MLEW Tracker] /runtime-config.json に mlewTracker の設定が無い` | デプロイ前の `pnpm dev` なら正常です。デプロイ後の URL で出るなら、`application-stack.ts` に `MlewTracker` が無いか、デプロイが古いままです。接続コードを確かめて再デプロイします |
| 送信が `400` で `domain ... does not match` | app monitor が受け付けるのは、モックの CloudFront のドメインと `localhost` だけです。別のドメインから開いていないか確かめます |
| クリックが記録されない | 要素に `data-track-name` が付いているか、値が空でないかを確かめます |
| 値を直したのにデプロイ先に反映されない | 再デプロイする（手順はデプロイメントガイド） |
