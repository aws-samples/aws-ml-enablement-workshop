# MLEW Tracker

ML Enablement Workshop で作成したモックアプリケーションの反応を計測するための、Webアナリティクス追跡システムです。

## 📦 パッケージ構成

- **tracker-sdk**: Webサイトに埋め込むJavaScript SDK
- **dashboard**: アナリティクスダッシュボード（React）
- **aws-infrastructure**: AWS CDKによるインフラコード

## 🎯 クイックスタート

### 前提条件

- Node.js 18.x 以上
- AWS CLI 設定済み
- AWS CDK CLI インストール済み (`npm install -g aws-cdk`)

### 1. インフラストラクチャのデプロイ

```bash
# ワークショップリポジトリをクローン
git clone https://github.com/aws-samples/aws-ml-enablement-workshop
cd aws-ml-enablement-workshop/yourwork/tracker

# 依存関係のインストール（Lambda関数の依存関係も自動でインストールされます）
npm install

# AWSインフラをデプロイ（フルセットアップ）
npm run deploy:with-config
```

> **💡 推奨**: `deploy:with-config`コマンドを使用することで、デプロイ後に自動的にダッシュボード設定が更新され、即座に使用開始できます。

デプロイが完了すると、以下の情報が出力されます：
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

デプロイ後に表示されるDashboard URLにアクセスしてデータを確認。
設定は自動的に更新されているため、すぐに使用開始できます。

> **⚡ 重要**: 初回デプロイ及び通常の運用では `npm run deploy:with-config` を使用してください。これにより、デプロイ、設定更新、ダッシュボードのビルド・アップロードが一括実行されます。

## 🔧 設定の自動更新

`npm run deploy:with-config`を使用すると、以下の処理が自動実行されます：

1. **CDKデプロイ**: AWSインフラストラクチャの構築・更新
2. **設定自動取得**: デプロイ完了後にAPIエンドポイントとキーを取得
3. **ダッシュボード設定更新**: `.env.production`ファイルを自動生成
4. **ダッシュボードビルド**: 新しい設定でReactアプリをビルド
5. **S3アップロード**: ビルドしたダッシュボードをS3バケットに自動配置
6. **CloudFrontキャッシュクリア**: 最新版が即座にアクセス可能

これにより、デプロイ完了と同時にダッシュボードが使用可能状態になります。