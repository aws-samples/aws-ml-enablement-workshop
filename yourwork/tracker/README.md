# MLEW Tracker

ML Enablement Workshop で作成したモックアプリケーションの反応を計測するための、Webアナリティクス追跡システムです。

## 📦 パッケージ構成

- **tracker-sdk**: Webサイトに埋め込むJavaScript SDK
- **dashboard**: アナリティクスダッシュボード（React）
- **lambdas**: Lambda 関数のソースコード（ワークスペース単位で管理）
- **cdk-app**: AWS CDK によるインフラ定義（バックエンド・配信基盤）

## 🚀 デプロイ方法

### 1. CloudFormation でデプロイ

MLEW Tracker は CloudFormation テンプレート `MLEWTrackerDeploymentStack.yaml` を用いたワンクリックデプロイに統一されています。スタックを作成すると、付属の CodeBuild プロジェクトがリポジトリをクローンし、Lambda・ダッシュボード・SDK をビルドしたのち AWS CDK (`cdk-app`) でインフラをデプロイします。

```bash
# yourwork/ で実行。スタック名は当日のガイド（yourwork/README.md）と揃える
aws cloudformation deploy \
  --template-file ./tracker/MLEWTrackerDeploymentStack.yaml \
  --stack-name mlew-tracker-stack \
  --parameter-overrides \
    NotificationEmailAddress=your-email@example.com \
    Environment=dev \
  --capabilities CAPABILITY_IAM \
  --region ap-northeast-1
```

- CodeBuild は既定で GitHub の `aws-samples/aws-ml-enablement-workshop` の `main` ブランチをクローンします。手元のテンプレートではなく、クローンしたソースがデプロイされます。フォークやブランチを使う場合は、パラメータ `GitRepositoryUrl` と `GitBranch` で変えます。
- CodeBuild がデプロイ前に `cdk bootstrap` を自動で実行するので、Tracker 用に手で bootstrap する必要はありません。
- ビルドやデプロイに失敗すると「MLEW Tracker Deployment Failed」メール（CodeBuild のログへのリンク付き）が届き、完了メールは届きません。
- Tracker はアカウントに 1 つです。S3 バケット名（`mlew-sdk-<アカウントID>` など）がアカウント単位で、リージョンや環境名を含まないため、同じアカウントの別リージョン・別環境名で 2 つ目はデプロイできません。

パイプラインで行われる主な処理:
- ルートで `npm ci` を実行して依存関係を整備
- `npm run build --workspace=packages/dashboard` と `npm run build --workspace=packages/tracker-sdk` で静的アセットをビルド
- `npm ci --prefix cdk-app` で CDK 依存関係をインストールし、`cdk bootstrap` のあと `npx cdk deploy` によりバックエンド/配信基盤をデプロイ（Lambda は CDK の NodejsFunction でバンドル、ダッシュボードと SDK は `BucketDeployment` で配置）

デプロイ完了後、SNS の完了通知メールに以下が記載されます。
- **API Endpoint**: API Gateway の URL（例 `https://xxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/dev`、末尾に `/` は付かない）
- **API Key**: API 認証用キー
- **Dashboard URL**: ダッシュボードの URL（例 `https://dxxxxxxxx.cloudfront.net`）
- **Tracker SDK URL**: SDK の URL（例 `https://dyyyyyyyy.cloudfront.net/tracker-sdk.js`）。Dashboard URL とはドメインが異なります

#### 4 つの値を取り直す

メールが届かない・見失った場合は、CDK が作る子スタック `MLEWTrackerStack-<環境名>`（既定 `MLEWTrackerStack-dev`）の Outputs から組み立てます。

```bash
aws cloudformation describe-stacks --region <Tracker のリージョン> \
  --stack-name MLEWTrackerStack-dev --query 'Stacks[0].Outputs'
# ApiKeyId は ID なので、キーの値は次で取得する
aws apigateway get-api-key --region <Tracker のリージョン> \
  --api-key <ApiKeyId の値> --include-value --query value --output text
```

| 値 | 組み立て方 |
| --- | --- |
| API Endpoint | `ApiEndpoint` の値そのまま（末尾に `/` を付けない） |
| API Key | 上の `get-api-key` の出力（`ApiKeyId` の値ではない） |
| Dashboard URL | `https://` + `DashboardURL` の値 |
| Tracker SDK URL | `https://` + `SdkDistributionDomain` の値 + `/tracker-sdk.js` |

### 2. Webサイトへの統合

デプロイ完了後、出力されたAPI情報を使用してSDKを統合します：

```html
<!-- MLEW Tracker SDK -->
<script src="https://your-cdn-url/tracker-sdk.js"></script>
<script>
  const tracker = new MLEWTracker.Tracker({
    applicationId: 'my-app',
    applicationName: 'My Application',
    apiEndpoint: 'https://your-api.execute-api.ap-northeast-1.amazonaws.com/dev',  // デプロイ時に出力された値（末尾に / を付けない）
    apiKey: 'YOUR_API_KEY',  // デプロイ時に出力された値
    autoTrack: true
  });
</script>
```

> ⚠️ 上のインライン初期化は CSP の無いサイト向けです。CSP のあるサイト（ワークショップのモックは `script-src 'self'`）ではインライン script が実行されないため、初期化をバンドルされる JS に移し、SDK のオリジン（Tracker SDK URL のスキーム+ホスト）を `script-src` に追加してください。モックでの具体的な手順は `yourwork/template/TRANCKER_INTEGRATION_GUIDE.md` を参照してください。

### 3. ダッシュボードでデータ確認

デプロイ後に表示されるDashboard URLにアクセスしてデータが確認可能です。

### 4. 削除

親スタックを削除すると、子スタック `MLEWTrackerStack-<環境名>` の削除も自動で始まります。

```bash
aws cloudformation delete-stack --region <Tracker のリージョン> --stack-name mlew-tracker-stack
```

子スタックの削除は非同期で進み、数分（実測 3 分）〜20 分かかります。次のコマンドが `does not exist` のエラーを返せば完了です。

```bash
aws cloudformation describe-stacks --region <Tracker のリージョン> \
  --stack-name MLEWTrackerStack-dev --query 'Stacks[0].StackStatus'
```

`DELETE_FAILED` のまま止まった場合や、20 分以上たっても `CREATE_COMPLETE` などのまま削除が始まらない場合は、子スタックを手で削除します。

```bash
aws cloudformation delete-stack --region <Tracker のリージョン> --stack-name MLEWTrackerStack-dev
```
