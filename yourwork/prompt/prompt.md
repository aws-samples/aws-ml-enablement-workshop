このプロンプトは `aws-ml-enablement-workshop/yourwork` をカレントディレクトリとして実行します。以下に出てくるパスはすべてこのディレクトリからの相対パスです。

# このプロンプトで作るもの

`<application_requirements>` で定義された Web アプリケーションを、MVP として動作する状態まで実装し、`<tracker_configuration>` の MLEW トラッカーで利用者の反応を計測できる形にして AWS にデプロイします。

判断に迷ったときは、次の基準で決めてください。

- **MVP 優先**: 要件を満たす最小の構成を選びます。機能を増やすより、画面が一通り動くことを先に成立させます。
- **モック前提**: バックエンド API・データベース・外部サービス連携はモック実装で構いません。トラッカーだけは例外で、実際の SDK と実際のエンドポイントを使います。
- **UI の動作確認を最優先**: このワークショップの目的は実際の利用者に触ってもらって反応を測ることなので、内部設計の美しさよりも、画面が表示され操作でき計測が飛ぶことを優先します。

<application_requirements>
{ここに作成したいアプリケーションの詳細を入力してください}
</application_requirements>

<tracker_configuration>
{以下にデプロイしたMLEWトラッカーのエンドポイント情報を入力してください}
- **API Endpoint**: `https://xxxxxxxx.execute-api.us-west-2.amazonaws.com/dev/`
- **API Key**: dummyapikey
- **Dashboard URL**: `https://xxxxxxxx.cloudfront.net`
- **Tracker SDK URL** : `https://xxxxxxxx.cloudfront.net/tracker-sdk.js`
</tracker_configuration>

# 成果物

1. **ランディングページ（LP）**: アプリケーションへの導線となるページ
2. **メインアプリケーション**: MVP レベルで一通り動作する実装
3. **インフラストラクチャ**: Nx の infra プロジェクト（AWS CDK）とデプロイ手順

作業場所は `product/` ディレクトリです（ファイルではなくディレクトリとして作成してください）。技術選定は Nx Plugin for AWS の生成物（TanStack Router / shadcn / Tailwind CSS v4 / AWS CDK）に従い、ビルドとデプロイの詳細は `template/DEPLOYMENT_GUIDE.md` に従います。

# 前提条件

- Node.js 22.12 以上（または 20.19 以上）。生成物の vite と nx がこれを要求するため、Node 18 では動きません。
- pnpm。依存が `catalog:` 指定のため、npm では install できません。
- uv。infra の build に含まれる checkov を `uvx` で実行するため、無いと `uvx: command not found` で build が失敗します。
- AWS CLI v2 と認証情報。モック本体はプロファイルの既定リージョンにデプロイされます（環境変数 `AWS_REGION` があるとそちらが優先されます）。CloudFront 用の WAF は常に us-east-1 の別スタックになります。

# 実装の方針

- **ルーティング**: TanStack Router のファイルベースルーティング（`packages/website/src/routes/*.tsx`）を使います。React Router ではありません。
- **レイアウト**: 生成された `__root.tsx` は全ルートをサイドバー付きの AppLayout で包むため、そのままでは LP にもサイドバーが出ます。`__root.tsx` は `<Outlet />` だけにし、AppLayout は `routes/app/route.tsx`（`/app` 配下のレイアウト）で使います。
- **404**: 生成直後は存在しない URL で英語の「Not Found」だけが出ます。`__root.tsx` の `notFoundComponent` に日本語の 404 とトップへ戻るリンクを置きます。
- **言語設定**: 生成された `packages/website/index.html` は `lang="en"` なので `lang="ja"` に変え、`<title>` と `description` もプロダクトに合わせます。
- **パンくず**: 生成された AppLayout のパンくずはクエリ文字列を `?` なしで連結するバグがあります（`/appscenario=x` のようなリンクになる）。`URLSearchParams` で `?` 付きに直します。パンくずには URL の区切り（`app` など）がそのまま英語で出るので、画面名の日本語ラベルに置き換えます。
- **サンプルデータ**: イレギュラーな入力で画面が壊れないよう、事前定義したサンプルデータを用意します。
- **言語**: 特別な指定がない限り、画面に出るテキストはすべて日本語にします。
- **画像**: まずプレースホルダーで実装を完成させます。プレースホルダーは外部 URL ではなく、ローカル画像か CSS/SVG で作ります。CloudFront の CSP が `img-src 'self' data:` / `font-src 'self' data:` なので、外部の画像サービスや Google Fonts などの外部フォントは本番でブロックされます（`pnpm dev` では見えるので気付きにくい点に注意してください）。アプリケーションが動いたあと、画像生成 MCP が利用できる場合（例: Amazon Nova Canvas の MCP サーバー）は人物・商品・風景の画像を生成し、`packages/website/public/` に配置して直接パスで参照します。画像生成 MCP が使えない環境では、プレースホルダーのままで構いません。
- **Tailwind CSS v4 の設定**: テーマの既定値（`@theme`・`:root` の CSS 変数）は `packages/common/shadcn/src/styles/globals.css` にあります。生成された `packages/website/src/styles.css` は `@import` と `@source` の 2 行だけなので、色などの上書きはこのファイルに `@theme` / `:root` を追記して行い、ベーススタイルは `@layer base` 内に記述します。v4 は設定を CSS 側で行う方式のため、旧来の設定ファイルに色を書いてもクラスが生成されず、配色が反映されない画面になります。
- **整形**: build には Biome の format/lint、vitest、checkov が含まれます。整形漏れで build が失敗したら `product/` で `pnpm lint` を実行すると自動修正されます。

# トラッカーの統合

計測の実装は `template/TRANCKER_INTEGRATION_GUIDE.md` に従います。統合の要点は次のとおりです。

- **外部 SDK `tracker-sdk.js` を script タグで読み込んで使います。** トラッカーを自分で実装すると、見た目は動いているのにイベントがどこにも送信されず、実データで反応を測るというワークショップの目的が達成できません。SDK の中身は書き換えず、読み込んで使うだけにしてください。
- **SDK の読み込みと初期化を分けます。** `packages/website/index.html` の `<head>` に `<script src="<Tracker SDK URL>"></script>` を async/defer なしで置き、バンドルより先に読ませます。初期化はインライン script ではなく `packages/website/src/services/mlewTracker.ts` で行い、`main.tsx` の先頭で呼びます。CSP がインラインの script を実行しないためです。
- **SDK URL は `<tracker_configuration>` の Tracker SDK URL を使います。** Dashboard URL のドメインではありません。エンドポイントと API Key も `<tracker_configuration>` の値をそのまま使い（`packages/website/src/config.ts` に置く）、`applicationId` は製品名に基づいて設定します。
- **SDK の既知の挙動に対処します。** いずれも SPA 共通の挙動で、SDK は編集せずアプリ側で対処します。
  1. autoTrack のページビューは初回表示と戻る・進む（popstate）だけで、Link による遷移は記録されません。`router.history.subscribe` で、action が PUSH / REPLACE のときだけ `trackView` を呼びます。BACK / FORWARD は SDK が記録するので、含めると二重になります。
  2. クリックの page は記録時点の `location.pathname` なので、Link のクリックは遷移先のページとして記録されます。キャプチャ段階のクリックリスナーで、最寄りの `[data-track="true"]` 要素の `data-track-page` に遷移前のパスを入れます（SDK は `data-track-*` をプロパティにし page を上書きします）。
  3. SDK はコンストラクタで初回ページビューを送るため、`setUserId` より先に送られて userId が空になります。SDK を生成する前に `localStorage.setItem('mlew_tracker_userId', visitorId)` で訪問者 ID を書いておきます（SDK は起動時にこのキーから userId を復元します）。
- **計測対象**: すべての CTA ボタン（購入・申込み・問い合わせなど）、すべてのナビゲーションリンク（ヘッダー・サイドバー・パンくず・フッター・404 の戻るリンクを含む）、すべてのフォーム送信イベント。開閉ボタンなどの UI 操作に付けても構いません。

# 進め方

**Phase 1: インフラ準備（最初に着手）**

Nx Plugin for AWS で `product/` に雛形を作ります。次の順番で実行してください。順番を入れ替えると型エラーや build の停止が起きます。

1. `yourwork/` で `pnpm create @aws/nx-workspace product --no-interactive` を実行してワークスペースを作成する。途中で husky の `.git can't be found` が出ますが、`product/` が親リポジトリの管理外なだけで無害です
2. `cd product` して `pnpm nx g @aws/nx-plugin:ts#website website --no-interactive` と `pnpm nx g @aws/nx-plugin:ts#infra infra --no-interactive` を実行する
3. `pnpm nx sync` を実行する。generator の直後は「The workspace is out of sync」で compile が止まります
4. `nx.json` に `"useDaemonProcess": false` を追加する。`product/` はリポジトリの `.gitignore` 対象のため、Nx デーモンがソースの変更を検知できず、古いビルドがデプロイされます
5. `packages/common/constructs/src/core/static-website.ts` を 2 点改修する（下のコード）
   - 生成される CSP は `script-src 'self'` なので、Tracker SDK の配信元を足せる `scriptSrc?: string[]` プロパティを追加する
   - KMS キーに `removalPolicy: RemovalPolicy.DESTROY` と `pendingWindow: Duration.days(7)` を付ける。既定は RETAIN のため、削除後もキーが残って課金が続きます
6. `packages/infra/src/stacks/application-stack.ts` の ApplicationStack に Website を追加する（下のコード）。生成直後の ApplicationStack は空で、追加しないとデプロイしても何も作られません
   - `TRACKER_SDK_ORIGIN` には `<tracker_configuration>` の Tracker SDK URL のスキームとホストだけを入れます（例 `https://xxxxxxxx.cloudfront.net`、パスなし）
   - Tracker 情報が未指定なら `scriptSrc` を省略します。index.html の SDK の script タグも置かず、`config.ts` の `tracker` は空文字で用意します（`mlewTracker.ts` が参照するため）。この場合、コンソールの `MLEW Tracker SDK not loaded` は想定どおりです。あとで追加したら、`pnpm nx deploy-sandbox infra` を再実行して CSP を更新します
7. アカウントで初めて使う場合だけ `pnpm nx bootstrap infra` を実行する。引数なしの bootstrap は、デプロイ先リージョンと WAF 用の us-east-1 の両方を bootstrap します

`static-website.ts` の改修:

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

`application-stack.ts`:

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

**Phase 2: アプリケーション開発**

`product/construction/plan.md` にチェックボックス付きの実装計画を日本語で作成し、実装しながら進捗を更新します。ローカルでは `product/` で `pnpm dev` を実行し、http://localhost:4200 で確認します。本番ビルドの確認は `pnpm nx run @product/website:preview`（http://localhost:4300）で行えます。

実装が固まったら、`product/` で `pnpm nx deploy-sandbox infra` を実行して AWS にデプロイします。初回は 4 分ほどかかります。デプロイ後の URL は、CDK の Outputs に出る `...WebsiteDistributionDomainName...` の値（`xxxx.cloudfront.net`）です。あとから確認するときは `aws cloudformation describe-stacks --stack-name product-infra-sandbox-Application --query 'Stacks[0].Outputs'` を使います。

# 完了条件

以下がすべて満たされた時点で完了です。「確認しました」という報告では完了とせず、それぞれコマンドの出力か該当行を示してください。

- `product/` で `pnpm nx run-many -t build` が成功する（infra の checkov を含む）— 末尾の出力を示す
- ルーティングが機能する — LP から各画面へ遷移でき、直接 URL でも表示されることを、確認した経路とともに示す
- （Tracker 情報がある場合）`tracker-sdk.js` の外部読み込みが実在する — `grep -rn --exclude-dir=node_modules --exclude-dir=dist "tracker-sdk.js" product/packages/website/` の出力で、`packages/website/index.html` の script タグの行を示す
- デプロイ後の CloudFront の URL にアクセスでき、ブラウザのコンソールに CSP 違反（`Refused to load the script` / `Refused to execute inline script`）が出ていない
- （Tracker 情報がある場合）Tracker への送信が成功している — `/v1/events` への POST が 200 を返す、またはダッシュボードにイベントが表示される

# 削除

ユーザーから明示的な削除指示があった場合にのみ実行します。デプロイしたままだと WAF と KMS キーの固定費（約 $8/月）がかかり続けます。

1. `product/` で `pnpm nx destroy-sandbox infra -- --force` を実行する。`destroy-sandbox` の中身は確認付きの `cdk destroy` で、TTY の無いエージェントのシェルでは確認できずに `TtyNotAttached` で失敗するため、`--force` を付けます（`--` の後ろが cdk に渡ります）。バケットは autoDeleteObjects 付きなので、手で空にする必要はありません
2. デプロイ先リージョンと us-east-1 の両方で `aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE` を実行し、`product-infra-sandbox-` で始まるスタックが残っていないことを確認する。WAF のスタックは us-east-1 にあるため、デプロイ先だけ見ると取り残しに気付けません
3. KMS キーは 7 日後に削除されます。削除待ちの間は課金されません
