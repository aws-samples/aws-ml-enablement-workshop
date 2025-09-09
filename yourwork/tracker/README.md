# MLEW Tracker

ML Enablement Workshop で作成したモックアプリケーションの反応を計測するための、Webアナリティクス追跡システムです。

## 📦 パッケージ構成

- **tracker-sdk**: Webサイトに埋め込むJavaScript SDK
- **dashboard**: アナリティクスダッシュボード（React）
- **cdk**: AWS CDKによるインフラストラクチャコード

## 🚀 デプロイ方法

MLEW Trackerは2つのデプロイ方法を提供しています：

### 方法1: CloudFormation（推奨・簡易）
最も簡単なワンクリックデプロイ。GitHubからの自動ビルド・デプロイ機能付き。

```bash
# CloudFormationテンプレートを使用した簡易デプロイ
aws cloudformation deploy \
  --template-file MLEWTrackerDeploymentStack.yaml \
  --stack-name mlew-tracker \
  --parameter-overrides NotificationEmailAddress=your-email@example.com \
  --capabilities CAPABILITY_IAM
```

**特徴:**
- ワンクリックデプロイ
- GitHubからの自動ビルド・デプロイ
- メール通知機能

### 方法2: AWS CDK（高度なカスタマイズ）
開発者向け。細かなカスタマイズや段階的デプロイが可能。

```bash
# CDKを使用したカスタマイズ可能なデプロイ
npm install
npm run deploy:with-config
```

**特徴:**
- TypeScriptによる型安全なインフラ定義
- テスト駆動開発対応
- 段階的デプロイ・更新
- 高度なカスタマイズ
  
デプロイが完了すると、以下の情報が出力されます。
- **API Endpoint**: APIゲートウェイのURL
- **API Key**: API認証用のキー
- **Dashboard URL**: ダッシュボードのCloudFront URL

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
