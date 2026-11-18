このプロンプトは `aws-ml-enablement-workshop/yourwork` をカレントディレクトリとして実行します。以下に出てくるパスはすべてこのディレクトリからの相対パスです。

# このプロンプトで作るもの

`<application_requirements>` で定義された Web アプリケーションを、MVP として動作する状態まで実装し、`<tracker_configuration>` の MLEW Tracker で利用者の反応を計測できる形にして AWS にデプロイします。モックはプロダクトの仮説を実際の利用者で検証するための道具で、本番運用するアプリケーションではありません。

判断に迷ったときは、次の基準で決めてください。

- **MVP 優先**: 要件を満たす最小の構成を選びます。機能を増やすより、画面が一通り動くことを先に成立させます。
- **モック前提**: バックエンド API・データベース・外部サービス連携はモック実装で構いません。認証・多言語対応・監視は作りません。Tracker だけは例外で、実際の SDK と実際のエンドポイントを使います。
- **UI の動作確認を最優先**: 内部設計の美しさよりも、画面が表示され操作でき、計測が届くことを優先します。
- **インフラは生成物に任せる**: Nx Plugin for AWS が生成したインフラのコードは書き換えず、設定は公開 props と、plugin が設定用に生成するファイル（デプロイ先の `stages.config.ts`）で渡します。セキュリティ（CSP・WAF・checkov）は生成物の既定値に任せます。

<application_requirements>
{ここに作成したいアプリケーションの詳細を入力してください}
</application_requirements>

<tracker_configuration>
- **API Endpoint**: `https://xxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/dev`
- **API Key**: `dummyapikey`
- **Dashboard URL**: `https://xxxxxxxx.cloudfront.net`
</tracker_configuration>

- **受け取った Tracker の値がプレースホルダーのままなら着手しません。** 依頼文などで受け取った API Endpoint / API Key が、`{` を含む、`xxxxxxxx` を含む、`dummyapikey` である、のどれかに当たるときは、正しい値をユーザーに確認してから進めます。ダミー値のままデプロイすると、計測が届かないモックが完成してしまうためです。値の取り直し方は `README.md` の「2. Tracker システムのデプロイ」にあるので、ユーザーにはそこを案内します。
- ユーザーが「Tracker を使わない」と明示したときだけ、Tracker なしで進めます。この場合は、計測が動かない状態で完成することを先に伝えます。

# 成果物

1. **ランディングページ（LP）**: アプリケーションへの導線となるページ
2. **メインアプリケーション**: MVP レベルで一通り動作する実装
3. **インフラストラクチャ**: Nx の infra プロジェクト（AWS CDK）

作業場所は `product/` ディレクトリです（ファイルではなくディレクトリとして作成してください）。技術選定は Nx Plugin for AWS の生成物（TanStack Router / shadcn / Tailwind CSS v4 / AWS CDK）に従います。

# 参照するファイル

このファイルには目的・判断基準・完了条件だけを書いています。手順は次のファイルにあるので、該当する作業の前に読んでください。

| 内容 | 場所 |
|---|---|
| 前提条件、リージョンの決め方、生成からデプロイまでの手順、削除 | `template/DEPLOYMENT_GUIDE.md`（`## 前提条件` / `## リージョンの決め方` / `## 削除`） |
| 生成物の既知の問題への対処 | `template/DEPLOYMENT_GUIDE.md` の `## 既知の問題への対処（@aws/nx-plugin 1.0.6 で確認）` |
| 計測（固定ファイル、接続コード、命名規約、計測対象） | `template/TRACKER_INTEGRATION_GUIDE.md` |
| 検証済みバージョン、シェルの扱い、ディレクトリの決まりごと | `AGENTS.md`（`## 検証済みバージョン` / `## シェルの扱い`） |

コマンドはエージェントが使うシェルに合わせて書きます。シェルで書き方が変わる部分の扱いは `AGENTS.md` の `## シェルの扱い` に従います。

# 実装の方針

- **ルーティング**: TanStack Router のファイルベースルーティングを使います。React Router ではありません。
- **LP とアプリの分離**: LP はアプリ画面のレイアウト（サイドバーなど）を持たない独立したページにし、アプリ画面への導線を置きます。
- **言語**: 特別な指定がない限り、画面に出るテキストは既定の画面やページタイトルも含めてすべて日本語にします。
- **サンプルデータ**: イレギュラーな入力で画面が壊れないよう、事前定義したサンプルデータを用意します。
- **画像とフォント**: 外部の画像サービスや外部フォントは使いません。`pnpm dev` では見えても、本番では表示されないことがあるためです（理由は `template/DEPLOYMENT_GUIDE.md` の既知の問題への対処）。まずローカル画像か CSS/SVG のプレースホルダーで完成させ、画像生成 MCP が使える場合（例: Amazon Nova Canvas の MCP サーバー）は、アプリが動いたあとに画像を生成して website の `public/` に置きます。使えない環境では、プレースホルダーのままで構いません。
- **生成物の既知の問題**: 生成物の挙動が想定と違うときは、試行錯誤する前に `template/DEPLOYMENT_GUIDE.md` の既知の問題への対処を確認します。

# Tracker の統合

計測の目的は、実際の利用者の反応を、モックの版（v1 / v2 など）をまたいで同じ名前で比べることです。そのため、計測は `template/TRACKER_INTEGRATION_GUIDE.md` の固定ファイル・命名規約・計測対象にそのまま従い、Tracker を自作したり、固定ファイルを書き換えたりしません。自作すると、見た目は動いていてもイベントが届かず、この目的が果たせません。

# 進め方

**Phase 1: インフラ準備（最初に着手）**

- **再実行かどうか**: `product/` があれば再実行です。`product/construction/plan.md` があれば、デプロイ先リージョンと進捗を引き継ぎます。生成の各手順は、`template/DEPLOYMENT_GUIDE.md` の「再実行するとき」の判定で、できていないものだけ実行します。生成を重ねると既存の成果物と衝突し、途中で失敗した手順を飛ばすと古いビルドがデプロイされるためです。
- **前提条件**: `template/DEPLOYMENT_GUIDE.md` の `## 前提条件` を確認します。満たしていない項目があれば、着手せずユーザーに伝えます。
- **デプロイ先リージョンとプロファイル**: デプロイに使う AWS のプロファイル名をユーザーに確認し（`template/DEPLOYMENT_GUIDE.md` の `## 前提条件`）、リージョンを `## リージョンの決め方` で決めて、どちらも控えておきます。一度決めた値は、bootstrap・デプロイ・削除のすべてで使い続けます。
- **生成**: `template/DEPLOYMENT_GUIDE.md` の手順で、検証済みバージョン（`AGENTS.md` の `## 検証済みバージョン`）を指定してワークスペースを生成します。
- **記録**: 生成が終わってから `product/construction/plan.md` を作り、控えておいたデプロイ先リージョンとプロファイル名を記録します（生成より前に `product/` を作らないため）。

**Phase 2: アプリケーション開発とデプロイ**

`product/construction/plan.md` にチェックボックス付きの実装計画を日本語で書き、実装しながら進捗を更新します。ローカルで画面を確認しながら実装し、固まったら `template/DEPLOYMENT_GUIDE.md` の手順でデプロイします。

# 完了条件

以下がすべて満たされた時点で完了です。「確認しました」という報告では完了とせず、エージェントが実行したコマンドとその出力を示してください。コマンドの書き方は実行するシェルに合わせます（`AGENTS.md` の「シェルの扱い」）。`<URL>` はデプロイ後の CloudFront の URL（`https://` 付き）です。

1. **build が通る**: `product/` で `pnpm nx run-many -t build` が成功する（Biome、Vitest、infra の synth と checkov を含む）。末尾の出力を示します。
2. **画面が配信されている**: website のルート定義の一覧を示し、`<URL>/` が 200 を返すことと、その HTML の `<script type="module">` が指す JS が `Content-Type` に `javascript` を含んで 200 を返すことを示します。CloudFront は存在しないパスにも `index.html` を 200 で返す設定なので、各画面のパスへの 200 は画面がある証拠になりません。
3. **（Tracker を使う場合）SDK が同一オリジンから配信されている**: `curl -sI <URL>/tracker-sdk.js` の `Content-Type` が `javascript` を含み、`curl -s <URL>/tracker-sdk.js` の本文に `MLEWTracker` が含まれ、`curl -s <URL>/` の出力に `<script src="/tracker-sdk.js"></script>` が含まれることを示します。SDK を置き忘れても、同じ理由でステータスは 200 になります（`Content-Type` が `text/html` なら `index.html` が返っています）。
4. **（Tracker を使う場合）Tracker の API がイベントを受け付ける**: `template/TRACKER_INTEGRATION_GUIDE.md` の `## 確認` の手順で、アプリのコードとは別に検証用のテストイベントを 1 件 POST し、200 と `"success":true` が返ることを示します。実行したら、ダッシュボードに検証用のイベントが 1 件増えることをユーザーに伝えます。
5. **ダミー値が残っていない**: `product/packages` を `node_modules` と `dist` を除いて `xxxxxxxx`、`dummyapikey`、`your-app-id` で検索し、0 件であることを示します（POSIX シェルなら `grep -rnE`、PowerShell なら `Select-String`）。
6. **（Tracker を使う場合）計測が命名規約どおりで、二重に記録していない**: `template/TRACKER_INTEGRATION_GUIDE.md` の `## 確認` の方法で、`data-track-name` の値の一覧と `trackClick(` の呼び出し箇所の一覧を示します。

次の項目はブラウザが必要なので、エージェントは確認したと報告せず、デプロイ後の URL と Dashboard URL を添えてユーザーに確認を依頼します。

- ブラウザの開発者ツールのコンソールに CSP 違反（`Refused to load` / `Refused to execute`）が出ていない
- （Tracker を使う場合）LP からアプリ画面へ Link で遷移したときのページビューと、ボタンのクリックがダッシュボードに届いている

# 削除

ユーザーから明示的な削除指示があった場合にのみ、`template/DEPLOYMENT_GUIDE.md` の `## 削除` に従って実行します。デプロイしたままだと WAF と KMS キーの固定費がかかり続けるので、ワークショップの終了後に削除するかどうかをユーザーに伝えておきます。
