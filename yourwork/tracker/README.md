# MLEW Tracker

ML Enablement Workshop で作成したモックアプリケーションの反応を計測するための、Webアナリティクス追跡システムです。

## 📦 パッケージ構成

- **tracker-sdk**: Webサイトに埋め込むJavaScript SDK
- **dashboard**: アナリティクスダッシュボード（React）
- **lambdas**: Lambda 関数のソースコード（ワークスペース単位で管理）
- **cdk-app**: AWS CDK によるインフラ定義（バックエンド・配信基盤）

## 🚀 デプロイ方法

MLEW Tracker は CloudFormation テンプレート `MLEWTrackerDeploymentStack.yaml` を用いたワンクリックデプロイに統一されています。スタックを作成すると、付属の CodeBuild プロジェクトがリポジトリをクローンし、Lambda・ダッシュボード・SDK をビルドしたのち AWS CDK (`cdk-app`) でインフラをデプロイします。

```bash
# CloudFormation テンプレートによるデプロイ
aws cloudformation deploy \
  --template-file MLEWTrackerDeploymentStack.yaml \
  --stack-name mlew-tracker \
  --parameter-overrides NotificationEmailAddress=your-email@example.com \
  --capabilities CAPABILITY_IAM
```

パイプラインで行われる主な処理:
- ルートで `npm ci` を実行して依存関係を整備
- `npm run build --workspace=packages/dashboard` と `npm run build --workspace=packages/tracker-sdk` で静的アセットをビルド
- `npm ci --prefix cdk-app` で CDK 依存関係をインストールし、`npx cdk deploy` によりバックエンド/配信基盤をデプロイ（Lambda は CDK の NodejsFunction でバンドル、ダッシュボードと SDK は `BucketDeployment` で配置）

デプロイ完了後、SNS 通知メールおよび CodeBuild の `deployment-info.txt` から以下を確認できます。
- **API Endpoint**: API ゲートウェイの URL
- **API Key**: API 認証用キー
- **Dashboard URL**: ダッシュボードの CloudFront ドメイン
- **Tracker SDK URL**: SDK を配信する CloudFront ドメイン

### 2. Webサイトへの統合

デプロイ完了後、出力されたAPI情報を使用してSDKを統合します：

```html
<!-- MLEW Tracker SDK -->
<script src="https://your-cdn-url/tracker-sdk.js"></script>
<script>
  const tracker = new MLEWTracker.Tracker({
    applicationId: 'my-app',
    applicationName: 'My Application',
    apiEndpoint: 'https://your-api.amazonaws.com/dev/',  // デプロイ時に出力された値
    apiKey: 'YOUR_API_KEY',  // デプロイ時に出力された値
    autoTrack: true
  });
</script>
```

### 3. ダッシュボードでデータ確認

デプロイ後に表示されるDashboard URLにアクセスしてデータが確認可能です。
