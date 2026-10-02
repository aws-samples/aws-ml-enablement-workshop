# モックアプリ デプロイメントガイド（Nx Plugin for AWS）

## 概要

このガイドでは、[Nx Plugin for AWS](https://awslabs.github.io/nx-plugin-for-aws/) で生成したモックアプリを作成し、AWS にデプロイして削除するまでの手順を説明します。成果物は `yourwork/product/` に作ります。

- ランディングページ（`/`）とアプリ本体（`/app` 配下）を 1 つの website プロジェクトで管理します。
- インフラは CDK で定義し、`pnpm nx deploy-sandbox infra` の 1 コマンドでビルドからデプロイまで実行します。

## 技術スタック

| 用途 | 採用技術 |
| --- | --- |
| フロントエンド | React + TypeScript |
| ビルドツール | Vite |
| ルーティング | TanStack Router（ファイルベース、`packages/website/src/routes/*.tsx`） |
| UI | shadcn（`packages/common/shadcn`）+ Tailwind CSS v4 |
| 品質チェック | Biome（format / lint）、Vitest、checkov（infra） |
| インフラ | AWS CDK（Nx の infra プロジェクト） |
| ホスティング | S3 + CloudFront + AWS WAF + KMS（WAF は us-east-1 の別スタック） |

## 前提条件

| ツール | 条件・確認方法 |
| --- | --- |
| Node.js | 22.12 以上（または 20.19 以上）。Vite 8 と Nx の要件のため、Node 18 では動きません |
| pnpm | `npm install -g pnpm` で導入し、`pnpm --version` で確認します。依存が `catalog:` 指定のため npm では install できません |
| uv | infra のビルドに含まれる checkov を `uvx` で実行します。無いと `uvx: command not found` でビルドが失敗します |
| AWS CLI v2 | 認証情報を設定し、`aws sts get-caller-identity` で確認します |
| CDK bootstrap | アカウントごとに初回 1 回、`pnpm nx bootstrap infra` を実行します（手順は後述） |

### リージョン

- モック本体は AWS プロファイルの既定リージョン（`CDK_DEFAULT_REGION`）にデプロイされます。環境変数 `AWS_REGION` が設定されているとそちらが優先されるので注意してください。
- WAF は常に us-east-1 の別スタックに作られます（CloudFront 用の WAF は us-east-1 にしか作れないため）。
- Tracker は別のリージョンにあってもかまいません。エンドポイント URL で指定するだけです。

## 生成されるディレクトリ構造

```
yourwork/product/
├── nx.json                         # Nx の設定（useDaemonProcess を追加する）
├── package.json
├── pnpm-workspace.yaml
└── packages/
    ├── website/                    # React アプリ（LP とアプリ本体）
    │   ├── index.html              # Tracker SDK の script タグを置く
    │   ├── public/                 # 画像などの静的ファイル
    │   └── src/
    │       ├── main.tsx            # エントリポイント（Tracker 初期化とページビュー記録）
    │       ├── config.ts           # アプリ名と Tracker の接続情報
    │       ├── styles.css          # テーマ（Tailwind v4）
    │       ├── routes/             # TanStack Router のルート（__root.tsx, index.tsx, app/ ...）
    │       └── services/
    │           └── mlewTracker.ts  # Tracker の初期化と呼び出し（追加する）
    ├── infra/                      # CDK アプリ
    │   └── src/stacks/
    │       └── application-stack.ts  # Website を追加する
    └── common/
        ├── constructs/             # 共通 CDK コンストラクト
        │   └── src/core/static-website.ts  # S3 + CloudFront + WAF + KMS の定義（改修する）
        └── shadcn/                 # shadcn の UI コンポーネントと globals.css
```

## プロジェクト固有の変更箇所

| ファイル | 変更内容 |
| --- | --- |
| `nx.json` | `"useDaemonProcess": false` を追加する |
| `packages/common/constructs/src/core/static-website.ts` | CSP の `script-src` にオリジンを足せる `scriptSrc` プロパティを追加し、KMS キーを destroy で削除されるようにする（後述のコード） |
| `packages/infra/src/stacks/application-stack.ts` | Website を追加し、Tracker SDK のオリジンを `scriptSrc` に渡す（後述のコード） |
| `packages/website/index.html` | `<title>` と description を変更し、`<head>` に Tracker SDK の script タグを置く |
| `packages/website/src/config.ts` | `applicationName` と、Tracker の接続情報（`tracker` ブロック） |
| `packages/website/src/services/mlewTracker.ts` | Tracker の初期化と `trackView` / `trackClick` のラッパー（新規作成） |
| `packages/website/src/main.tsx` | 先頭で `initTracker()` を呼び、SPA の画面遷移をページビューとして記録する |
| `packages/website/src/routes/` | LP とアプリの各画面、レイアウト、404 |
| `packages/website/src/styles.css` | テーマ（ブランドカラーなど） |

### routes/ の注意点

- 生成された `__root.tsx` は全ルートをサイドバー付きの AppLayout で包むため、LP にもサイドバーが出ます。`__root.tsx` は `<Outlet />` だけにし、AppLayout は `routes/app/route.tsx`（`/app` 配下のレイアウト）で使います。
- 存在しない URL は英語の「Not Found」だけが表示されます。`__root.tsx` の `notFoundComponent` に日本語の 404 と、トップへ戻る Link（`data-track` 付き）を置きます。
- 生成された AppLayout のパンくずは、クエリ文字列を `?` なしで連結します（`/appscenario=x` のようなリンクになる）。`URLSearchParams` を使い `?` 付きで組み立て直します。

### styles.css の注意点

- テーマの既定値（`@theme`・`:root` の CSS 変数・`@layer base`）は `packages/common/shadcn/src/styles/globals.css` にあります。生成された `packages/website/src/styles.css` はこれを `@import` する 2 行だけなので、上書きはこのファイルに追記します。
- Tailwind v4 は CSS-first 構成です。`tailwind.config.js` は使わず、`@theme {}` ブロックで色やアニメーションを定義します（追記先は `packages/website/src/styles.css`）。

### 画像とフォント

- 画像は `packages/website/public/` に置き、`/image.png` のような直接パスで参照します。
- 外部 URL のプレースホルダー画像や外部フォント（Google Fonts など）は、デプロイ後に CSP でブロックされます。`pnpm dev` では表示されるので気付きにくい点に注意してください。プレースホルダーはローカル画像か CSS / SVG で作ります。

### Tracker の組み込み

`index.html` の script タグ、`mlewTracker.ts` と `main.tsx` のコード、`data-track` の付け方は [MLEW Tracker 導入ガイド](/yourwork/template/TRANCKER_INTEGRATION_GUIDE.md) に従います。CSP のため、`index.html` のインライン script での初期化は実行されません。

`config.ts` には次のブロックを足します（値は Tracker のデプロイ完了通知に書かれたものに置き換えます）。

```ts
  tracker: {
    applicationId: 'your-app-id',
    applicationName: 'あなたのアプリ名',
    apiEndpoint: 'https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/dev',
    apiKey: 'xxxxxxxx',
  },
```

## セットアップ手順

`yourwork/` で次の順に実行します。

### 1. ワークスペースを作成する

```bash
pnpm create @aws/nx-workspace product --no-interactive
```

### 2. website と infra を生成する

```bash
cd product
pnpm nx g @aws/nx-plugin:ts#website website --no-interactive
pnpm nx g @aws/nx-plugin:ts#infra infra --no-interactive
```

### 3. 同期する

```bash
pnpm nx sync
```

generator の直後は「The workspace is out of sync」で compile が止まるため、必ず実行します。

### 4. Nx デーモンを無効にする

`nx.json` に次を追加します。

```json
  "useDaemonProcess": false
```

`product/` は親リポジトリの `.gitignore` 対象のため、Nx デーモンがソースの変更を検知できません。デーモンが有効なままだと、変更後もキャッシュが使われ、古いビルドがデプロイされます。

### 5. static-website.ts を改修する

`packages/common/constructs/src/core/static-website.ts` を 2 点改修します。

- CSP の `script-src` に任意のオリジンを足せる `scriptSrc?: string[]` プロパティを追加する（Tracker SDK を読み込むため）
- KMS キーを `removalPolicy: RemovalPolicy.DESTROY` と `pendingWindow: Duration.days(7)` にする。既定は RETAIN のため、destroy 後もキーが残り $1/月 がかかり続けます

```ts
// 定数 CONTENT_SECURITY_POLICY を関数に変える
const buildContentSecurityPolicy = (scriptSrc: string[] = []) => [
  "default-src 'self'",
  ["script-src 'self'", ...scriptSrc].join(' '),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self' https: wss:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join('; ');

// StaticWebsiteProps に追加
  readonly scriptSrc?: string[];

// constructor の分割代入に scriptSrc を追加し、ResponseHeadersPolicy の
// contentSecurityPolicy: { contentSecurityPolicy: ..., override: true } の内側の値だけを置き換える
contentSecurityPolicy: buildContentSecurityPolicy(scriptSrc),

// KMS キー（生成コードでは encryptionKey ?? new Key(...) の式の中にある）
new Key(this, 'WebsiteKey', {
  enableKeyRotation,
  removalPolicy: RemovalPolicy.DESTROY,
  pendingWindow: Duration.days(7),
})
```

貼り付けた直後は Biome の整形チェックで build が失敗するので、`pnpm lint` で整形してください。

### 6. application-stack.ts に Website を追加する

生成直後の `ApplicationStack` は空で、このままデプロイしても何も作られません。`packages/infra/src/stacks/application-stack.ts` を次のようにします。

```ts
import { Website } from '@product/common-constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

// MLEW Tracker SDK の配信元。website の index.html に書いた SDK URL のオリジンと揃える。
const TRACKER_SDK_ORIGIN = 'https://xxxxxxxx.cloudfront.net';

export class ApplicationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new Website(this, 'Website', { scriptSrc: [TRACKER_SDK_ORIGIN] });
  }
}
```

- `TRACKER_SDK_ORIGIN` は Tracker SDK URL のスキームとホストだけを書きます（例 : `https://xxxxxxxx.cloudfront.net`、パスは付けない）。
- Tracker の情報がまだ無い場合は `scriptSrc` を省略します。あとで追加したら `pnpm nx deploy-sandbox infra` を再実行します。

### 7. CDK bootstrap（初回のみ）

```bash
pnpm nx bootstrap infra
```

アカウントごとに初回 1 回だけ実行します。引数なしの `cdk bootstrap` は、アプリがデプロイする全環境（デプロイ先リージョンと、WAF 用の us-east-1）を bootstrap します。

## ビルドとデプロイ

以下のコマンドはすべて `product/` 直下で実行します。

```bash
# 依存関係のインストール
pnpm install

# ビルド（Biome、Vitest、checkov を含む）
pnpm nx run-many -t build

# デプロイ（ビルドも実行される）
pnpm nx deploy-sandbox infra
```

デプロイすると次の 2 スタックが作られます。初回デプロイは 4 分前後かかります。

| スタック | リージョン |
| --- | --- |
| `product-infra-sandbox-Application` | デプロイ先リージョン |
| `product-infra-sandbox-ApplicationWebsitewaf...` | us-east-1 |

### アクセス URL の確認

デプロイ完了時に CDK の Outputs に出る `...WebsiteDistributionDomainName...` の値（`xxxx.cloudfront.net`）がアクセス先です。あとから確認するときは次を実行します。

```bash
aws cloudformation describe-stacks \
  --stack-name product-infra-sandbox-Application \
  --query 'Stacks[0].Outputs'
```

アプリを更新したときも `pnpm nx deploy-sandbox infra` を再実行するだけです。

## セキュリティ設定

### Content-Security-Policy

CloudFront がすべてのレスポンスに付ける CSP は次のとおりです（`script-src` の末尾に `scriptSrc` で渡したオリジンが加わります）。

```
default-src 'self'; script-src 'self' <scriptSrc のオリジン>; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https: wss:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
```

モック作りに影響するのは次の 3 点です。

- **外部 script は、オリジンを `scriptSrc` に追加したものだけ読み込めます。** Tracker SDK の配信元を `application-stack.ts` で必ず渡します。
- **インライン script は実行されません。** Tracker の初期化は `index.html` に書かず、`src/services/mlewTracker.ts` で行います。
- **外部の画像・フォントは読み込めません。** 画像は `public/` に置き、フォントはローカルのものを使います。

API 呼び出し（`connect-src`）は HTTPS / WSS であれば許可されているので、Tracker API への送信はそのまま通ります。

### その他のヘッダー

Strict-Transport-Security、X-Content-Type-Options: nosniff、X-Frame-Options: DENY、Referrer-Policy: strict-origin-when-cross-origin が付きます。

### AWS WAF

CloudFront に us-east-1 の Web ACL が関連付けられ、次の 2 ルールが有効です。

- `AWSManagedRulesCommonRuleSet`（一般的な Web の脆弱性への対策）
- `AWSManagedRulesKnownBadInputsRuleSet`（既知の不正な入力の遮断）

### S3 と KMS

S3 バケットは非公開で、CloudFront 経由でのみアクセスされます。バケットは KMS キーで暗号化されます。

## 費用

| 項目 | 月額（us-east-1 単価） |
| --- | --- |
| WAF Web ACL | $5 |
| WAF ルール 2 個 | $2 |
| KMS キー | $1 |
| 合計 | **約 $8 / 月 / デプロイ** |

- 固定費は時間割りで課金されます。1 週間で削除すれば約 $2 です。
- リクエスト課金は、モック程度のアクセスならほぼ $0 です。
- 旧構成（S3 + CloudFront のみ）は固定費がほぼ $0 でしたが、この構成は置いておくだけで費用がかかります。使い終わったら削除してください。

## 削除

`product/` で次を実行します。

```bash
pnpm nx destroy-sandbox infra
```

確認（y/n）を求められます。エージェントに実行させる場合など TTY の無いシェルでは確認できずに `TtyNotAttached` で失敗するので、`pnpm nx destroy-sandbox infra -- --force` を使います。


- S3 バケットは autoDeleteObjects 付きなので、手で空にする必要はありません。
- 削除後、デプロイ先リージョンと us-east-1 の両方でスタックが残っていないことを確認します。`product-infra-sandbox-` で始まるスタックが出てこなければ完了です。

```bash
aws cloudformation list-stacks \
  --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE \
  --region <デプロイ先リージョン>
aws cloudformation list-stacks \
  --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE \
  --region us-east-1
```

- KMS キーは 7 日後に削除されます。削除待ちの間は課金されません。

## ローカル開発

すべて `product/` 直下で実行します。

| 目的 | コマンド |
| --- | --- |
| 依存インストール | `pnpm install` |
| ローカル確認 | `pnpm dev`（website は http://localhost:4200） |
| 本番ビルドの確認 | `pnpm nx run @product/website:preview`（http://localhost:4300） |
| ビルド | `pnpm nx run-many -t build` |
| テスト | `pnpm nx run-many -t test` |
| 整形・lint の自動修正 | `pnpm lint` |

外部 URL の画像やフォントは `pnpm dev` では表示されても、デプロイ後は CSP でブロックされます。最終確認はデプロイ先の URL で行います。

## トラブルシューティング

### 変更したのに古いビルドがデプロイされる

Nx デーモンがソース変更を検知せず、キャッシュが使われています。`nx.json` に `"useDaemonProcess": false` があるか確認し、無ければ追加してから再デプロイします。

### 「The workspace is out of sync」で止まる

`pnpm nx sync` を実行してから、もう一度ビルドします。

### Biome のエラーで build が失敗する

整形漏れや lint 違反です。`pnpm lint` で自動修正してから、もう一度ビルドします。

### `uvx: command not found` で build が失敗する

infra の checkov が uv を必要とします。uv をインストールしてから、もう一度ビルドします。

### ブラウザのコンソールに CSP 違反が出る

| メッセージ | 原因と対処 |
| --- | --- |
| `Refused to load the script` | SDK の配信元が `script-src` に無い。`application-stack.ts` の `TRACKER_SDK_ORIGIN` を `index.html` の SDK URL のオリジン（スキーム + ホスト）と揃え、再デプロイする |
| `Refused to execute inline script` | `index.html` にインライン script がある。初期化を `src/services/mlewTracker.ts` に移す |
| 画像・フォントの読み込み拒否 | 外部 URL を参照している。`public/` に置いたファイルか CSS / SVG に置き換える |

### `TS2353` で `scriptSrc` がエラーになる

`Object literal may only specify known properties, and 'scriptSrc' does not exist` のようなエラーは、`static-website.ts` の改修漏れです。セットアップ手順 5 のとおり `StaticWebsiteProps` に `scriptSrc` を追加します。

### deploy で bootstrap のエラーが出る

対象アカウントが CDK bootstrap されていません。`pnpm nx bootstrap infra` を実行してから、もう一度デプロイします。WAF 用の us-east-1 も対象になります。

### 意図しないリージョンにデプロイされる

環境変数 `AWS_REGION` がプロファイルの既定リージョンより優先されています。`echo $AWS_REGION` で確認し、不要なら `unset AWS_REGION` してからデプロイします。
