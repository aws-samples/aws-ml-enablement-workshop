このプロンプトは `aws-ml-enablement-workshop/yourwork` をカレントディレクトリとして実行します。以下に出てくるパスはすべてこのディレクトリからの相対パスです。

# このプロンプトで作るもの

`<application_requirements>` で定義された Web アプリケーションを、MVP として動作する状態まで実装し、`<tracker_configuration>` の MLEW Tracker で利用者の反応を計測できる形にして AWS にデプロイします。モックはプロダクトの仮説を実際の利用者で検証するための道具で、本番運用するアプリケーションではありません。

判断に迷ったときは、次の基準で決めてください。

- **MVP 優先**: 要件を満たす最小の構成を選びます。機能を増やすより、画面が一通り動くことを先に成立させます。
- **モック前提**: バックエンド API・データベース・外部サービス連携はモック実装で構いません。認証・多言語対応・監視は作りません。Tracker だけは例外で、実際の SDK と実際のエンドポイントを使います。
- **UI の動作確認を最優先**: 内部設計の美しさよりも、画面が表示され操作でき、計測が届くことを優先します。
- **インフラは生成物に任せる**: Nx Plugin for AWS が生成したインフラのコード（CSP・WAF・KMS を含む既定値）は書き換えず、設定は公開 props で渡します。

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
- **画像とフォント**: 外部の画像サービスや外部フォントは使いません。生成された CSP が外部オリジンの画像とフォントを許可しないため、`pnpm dev` では見えても本番では表示されません。まずローカル画像か CSS/SVG のプレースホルダーで完成させ、画像生成 MCP が使える場合（例: Amazon Nova Canvas の MCP サーバー）は、アプリが動いたあとに画像を生成して website の `public/` に置きます。使えない環境では、プレースホルダーのままで構いません。
- **生成物の既知の問題**: 生成物の挙動が想定と違うときは、試行錯誤する前に `template/DEPLOYMENT_GUIDE.md` の既知の問題への対処を確認します。

# Tracker の統合

`template/TRACKER_INTEGRATION_GUIDE.md` に従います。判断の基準は次のとおりです。

- **Tracker を自作しません。** `template/` にある公式の固定ファイル（SDK と連携コード）をそのままモックにコピーし、生成されたファイルには接続コードだけを書きます。自作すると、見た目は動いているのにイベントがどこにも送信されず、実データで反応を測るという目的が達成できません。固定ファイルは書き換えません。
- **SPA 特有の SDK の挙動（Link 遷移のページビュー、クリック元のページ、初回ページビューの userId）への対処は固定ファイルが担います。** アプリ側で重ねて対処しません。
- **計測の名前はガイドの命名規約に従います。** モックの版をまたいで同じ操作を比べるためです。計測対象もガイドの `## 計測対象` に従います。
- `applicationId` は製品名に基づいて設定します。

# 進め方

**Phase 1: インフラ準備（最初に着手）**

- **再実行かどうか**: `product/nx.json` があれば生成済みです。生成の手順は飛ばし、`product/construction/plan.md` を読んでデプロイ先リージョンと進捗を引き継ぎます。生成を重ねると既存の成果物と衝突するためです。`product/` はあるのに `product/nx.json` が無いときは、生成が途中で失敗しています。作り直す前に、`product/` を消してよいかユーザーに確認します。
- **前提条件**: `template/DEPLOYMENT_GUIDE.md` の `## 前提条件` を確認します。満たしていない項目があれば、着手せずユーザーに伝えます。
- **デプロイ先リージョン**: `template/DEPLOYMENT_GUIDE.md` の `## リージョンの決め方` で決め、値を控えておきます。一度決めた値は、bootstrap・デプロイ・削除のすべてで使い続けます。
- **生成**: `template/DEPLOYMENT_GUIDE.md` の手順で、検証済みバージョン（`AGENTS.md` の `## 検証済みバージョン`）を指定してワークスペースを生成します。
- **記録**: 生成が終わってから `product/construction/plan.md` を作り、控えておいたデプロイ先リージョンを記録します。生成より前に `product/` を作ると、生成が失敗したり、失敗したのに生成済みと判定されたりするためです。

**Phase 2: アプリケーション開発とデプロイ**

`product/construction/plan.md` にチェックボックス付きの実装計画を日本語で書き、実装しながら進捗を更新します。ローカルで画面を確認しながら実装し、固まったら `template/DEPLOYMENT_GUIDE.md` の手順でデプロイします。

# 完了条件

以下がすべて満たされた時点で完了です。「確認しました」という報告では完了とせず、エージェントが実行したコマンドとその出力を示してください。コマンドの書き方は実行するシェルに合わせます（`AGENTS.md` の「シェルの扱い」）。`<URL>` はデプロイ後の CloudFront の URL（`https://` 付き）です。

1. **build が通る**: `product/` で `pnpm nx run-many -t build` が成功する（Biome、Vitest、infra の synth と checkov を含む）。末尾の出力を示します。
2. **画面が配信されている**: website のルート定義の一覧と、LP と各画面の URL に `curl -sI <URL>/<パス>` を実行した結果の 1 行目（HTTP ステータス）を示します。
3. **（Tracker を使う場合）SDK が同一オリジンから配信されている**: `curl -sI <URL>/tracker-sdk.js` が 200 を返し、`curl -s <URL>/` の出力に `<script src="/tracker-sdk.js"></script>` が含まれることを示します。
4. **（Tracker を使う場合）Tracker の API がイベントを受け付ける**: アプリのコードとは別に、検証用のテストイベントを 1 件 POST し、200 と `"success":true` が返ることを示します。
   - 送信する本文は、エージェントのファイル書き込みで `product/construction/verification-event.json` に作ります（シェルの引用符の違いを避けるため）。形式は `{"applicationId":"<モックの applicationId>","events":[{"eventType":"custom","elementName":"verification","timestamp":<現在の UNIX 時刻（ミリ秒）>,"page":"/","url":"<URL>/","sessionId":"verification","applicationName":"<製品名>","createdAt":"<現在時刻の ISO 8601>","version":"verification","properties":{"verification":true}}]}` です。`timestamp` が無いと API が 500 を返します。
   - 送信は 1 行で、`curl -s -i -X POST "<API Endpoint>/v1/events" -H "Content-Type: application/json" -H "X-Api-Key: <API Key>" --data-binary "@product/construction/verification-event.json"` です。
   - 実行したら、ダッシュボードに `properties.verification` が `true` のイベントが 1 件増えることをユーザーに伝えます。
5. **ダミー値が残っていない**: `product/packages` を `node_modules` と `dist` を除いて `xxxxxxxx` と `dummyapikey` で検索し、0 件であることを示します（POSIX シェルなら `grep -rnE`、PowerShell なら `Select-String`）。
6. **（Tracker を使う場合）同じ操作を二重に記録していない**: `product/packages/website/src` で `trackClick(` の呼び出し箇所を検索して一覧にし、どれも `data-track` を付けた要素の handler ではないことを示します（規則は `template/TRACKER_INTEGRATION_GUIDE.md`）。

次の項目はブラウザが必要なので、エージェントは確認したと報告せず、デプロイ後の URL と Dashboard URL を添えてユーザーに確認を依頼します。

- ブラウザの開発者ツールのコンソールに CSP 違反（`Refused to load` / `Refused to execute`）が出ていない
- （Tracker を使う場合）LP からアプリ画面へ Link で遷移したときのページビューと、ボタンのクリックがダッシュボードに届いている

# 削除

ユーザーから明示的な削除指示があった場合にのみ、`template/DEPLOYMENT_GUIDE.md` の `## 削除` に従って実行します。デプロイしたままだと WAF と KMS キーの固定費がかかり続けるので、ワークショップの終了後に削除するかどうかをユーザーに伝えておきます。
