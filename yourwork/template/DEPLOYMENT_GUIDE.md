# 社内標準 APP テンプレート デプロイメントガイド

## 概要

このガイドでは、社内標準 React アプリケーションテンプレートのデプロイメント手順を説明します。このテンプレートは、ランディングページとアプリケーションを統合した単一プロジェクト構成となっています。

## テンプレート構成

### 統合アーキテクチャ
- **単一プロジェクト構成**: ランディングページとアプリケーションを1つのReactアプリで管理
- **ルートベース分離**: `/` でランディングページ、`/app` でアプリケーション
- **コード分割**: Lazy loading による最適化されたリソース配信
- **共通コンポーネント**: 再利用可能なUIコンポーネント

### ディレクトリ構造
```
template/
├── app/                        # 統合Reactアプリケーション
│   ├── src/
│   │   ├── components/
│   │   │   ├── app/           # アプリケーション用コンポーネント
│   │   │   ├── landing/       # ランディングページ用コンポーネント
│   │   │   └── common/        # 共通コンポーネント
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx  # ランディングページ
│   │   │   └── AppPage.tsx      # アプリケーションページ
│   │   ├── routes/               # ルーティング設定
│   │   ├── hooks/                # カスタムフック
│   │   ├── services/             # APIサービス
│   │   └── config/               # 設定ファイル
│   ├── cloudformation.yaml      # AWS CloudFormationテンプレート
│   └── deploy-cloudformation.sh  # CloudFormationデプロイスクリプト
└── cloudformation/               # 追加のCloudFormationテンプレート（必要に応じて）
```

## 技術スタック

- **フロントエンド**: React + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS v4+ (CSS-first configuration) + Framer Motion
- **ルーティング**: React Router
- **テスト**: Vitest + Playwright
- **ホスティング**: AWS S3 + CloudFront
- **インフラ**: AWS CloudFormation

## プロジェクト固有の設定変更箇所

新しいプロジェクトを開始する際は、以下のファイルと箇所を必ず変更してください：

### 1. 基本設定ファイル

#### **package.json** (`template/app/package.json`)
```json
{
  "name": "@mlew/unified-template",  // → プロジェクト名に変更
  "version": "1.0.0",                // → 適切なバージョンに変更
  "description": "...",              // → プロジェクトの説明に変更
  "author": "MLEW Development Team", // → 開発チーム名に変更
  "keywords": ["mlew", ...],         // → プロジェクトのキーワードに変更
}
```

#### **index.html** (`template/app/index.html`)
```html
<title>MLEW Unified Template</title>  <!-- プロジェクト名に変更 -->
<meta name="description" content="..." />  <!-- プロジェクトの説明に変更 -->
```

### 2. UIコンポーネント

#### **HomePage.tsx** (`template/app/src/components/app/HomePage.tsx`)
- タイトル「MLEW React App Template」をプロジェクト名に変更
- 説明文をプロジェクトに合わせて変更

#### **LandingPage.tsx** (`template/app/src/pages/LandingPage.tsx`)
- ランディングページのコンテンツをプロジェクトに合わせて更新
- Hero Section、Features、Pricing等の内容を変更

### 3. AWS設定

#### **cloudformation.yaml** (`template/app/cloudformation.yaml`)
```yaml
Parameters:
  ProjectName:
    Default: "your-project"  # 実際のプロジェクト名に変更
  Environment:
    Default: "dev"          # 適切な環境名に変更
```

#### **deploy-cloudformation.sh** (`template/app/deploy-cloudformation.sh`)
- スクリプト内のデフォルト値を確認・変更

### 4. 環境変数

#### **.env** ファイル（新規作成）
```env
# API設定
VITE_API_URL=https://api.your-domain.com  # 実際のAPI URLに変更

# Analytics設定
VITE_ANALYTICS_ID=your-analytics-id  # Analytics IDに変更

# アプリケーション設定
VITE_APP_NAME=YourAppName  # アプリケーション名
VITE_ENVIRONMENT=development  # 環境名
```

### 5. スタイリング/ブランディング

#### **Tailwind CSS v4 設定** (`src/styles/globals.css`)
Tailwind CSS v4では設定ファイル不要のCSS-first approach を採用：

```css
@import "tailwindcss";

@theme {
  /* カスタムカラーパレット */
  --color-primary-500: #0ea5e9;  /* ブランドカラーに変更 */
  --color-primary-600: #0284c7;
  
  /* カスタムアニメーション */
  --animate-fade-in: fadeIn 0.5s ease-in-out;
}
```

**重要**: 
- ❌ `tailwind.config.js` は不要（削除済み）
- ❌ `postcss.config.js` は不要（削除済み）  
- ❌ `@tailwindcss/*` プラグインは不要（v4で内蔵）
- ✅ CSS内で `@theme {}` ブロックで設定

### 6. ランディングページのカスタマイズ

#### **各セクションコンポーネント** (`template/app/src/components/landing/sections/`)
- **HeroSection.tsx**: メインキャッチコピー、CTA
- **FeaturesSection.tsx**: 機能説明
- **PricingSection.tsx**: 料金プラン
- **ContactSection.tsx**: お問い合わせ情報
- **TestimonialsSection.tsx**: お客様の声

## 前提条件

### 必要なツール
- Node.js 20.x 以上
- npm 10.x 以上
- AWS CLI v2
- AWS アカウントと適切な権限

### AWS 設定
```bash
# AWS CLI の設定
aws configure

# 設定確認
aws sts get-caller-identity
```

## デプロイメント手順

### 1. プロジェクトのセットアップ

```bash
# プロジェクトディレクトリへ移動
cd template/app

# 依存関係のインストール
npm install
```

### 2. 環境設定

#### CloudFormationパラメーターの設定
`cloudformation.yaml` 内のパラメーターを確認・修正：

```yaml
Parameters:
  ProjectName:
    Default: "your-project"  # プロジェクト名に変更
```

### 3. ビルド

```bash
# プロダクションビルド
npm run build

# ビルド結果の確認
ls -la dist/
```

### 4. CloudFormationによるデプロイ

#### 初回デプロイ

```bash
# デプロイスクリプトの実行権限を付与
chmod +x deploy-cloudformation.sh

# デプロイ実行
./deploy-cloudformation.sh create your-project-dev

# またはパラメーターを指定してデプロイ
aws cloudformation create-stack \
  --stack-name your-project-dev \
  --template-body file://cloudformation.yaml \
  --parameters \
    ParameterKey=ProjectName,ParameterValue=your-project \
    ParameterKey=Environment,ParameterValue=dev \
  --capabilities CAPABILITY_IAM
```

#### 更新デプロイ

```bash
# スタックの更新
./deploy-cloudformation.sh update your-project-dev

# または
aws cloudformation update-stack \
  --stack-name your-project-dev \
  --template-body file://cloudformation.yaml \
  --parameters \
    ParameterKey=ProjectName,ParameterValue=your-project \
    ParameterKey=Environment,ParameterValue=dev \
  --capabilities CAPABILITY_IAM
```

### 5. アプリケーションのデプロイ

```bash
# S3バケット名を取得
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name your-project-dev \
  --query "Stacks[0].Outputs[?OutputKey=='S3BucketName'].OutputValue" \
  --output text)

# CloudFront Distribution IDを取得
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name your-project-dev \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" \
  --output text)

# S3へアップロード
aws s3 sync dist/ s3://${BUCKET_NAME} --delete

# CloudFrontキャッシュの無効化
aws cloudfront create-invalidation \
  --distribution-id ${DISTRIBUTION_ID} \
  --paths "/*"
```

### 6. アクセスURLの確認

```bash
# CloudFront URLを取得
aws cloudformation describe-stacks \
  --stack-name your-project-dev \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontURL'].OutputValue" \
  --output text
```

## ルーティング構成

アプリケーションは以下のルート構成を持ちます：

- **`/`** - ランディングページ
  - 製品紹介
  - 機能説明
  - 料金プラン
  - お問い合わせ
- **`/app`** - アプリケーションルート
  - ダッシュボード
  - 各種機能ページ
- **`/app/*`** - アプリケーション内の各ページ

## セキュリティ設定

### S3 バケット
- パブリックアクセスブロック有効
- CloudFront Origin Access Control (OAC) による制限付きアクセス
- バケットポリシーでCloudFrontからのみアクセス許可

### CloudFront
- HTTPS強制（Viewer Protocol Policy: redirect-to-https）
- セキュリティヘッダー追加
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Strict-Transport-Security
  - Content-Security-Policy

### アプリケーションセキュリティ
- 環境変数による機密情報の管理
- APIキーはフロントエンドに含めない
- CORS設定の適切な管理

## パフォーマンス最適化

### ビルド最適化
- コード分割（Code Splitting）
- Tree Shaking
- 圧縮（Minification）
- Source Maps（開発環境のみ）

### CloudFront設定
- 適切なキャッシュポリシー
- Gzip/Brotli圧縮
- HTTP/2サポート

### アプリケーション最適化
- Lazy Loading（ルートベース）
- 画像最適化
- Web Vitals監視

## トラブルシューティング

### よくある問題と解決方法

#### 1. CloudFormationスタックの作成失敗

##### S3バケットポリシーエラー: "Policy has invalid resource"
このエラーが発生した場合、CloudFormationテンプレートのS3バケットポリシーのResource指定を確認してください。

**問題の原因**:
```yaml
# 誤った記述
Resource: !Sub '${S3Bucket}/*'
# これは "bucket-name/*" となり、有効なARN形式ではありません
```

**解決方法**:
```yaml
# 正しい記述
Resource: !Sub 'arn:aws:s3:::${S3Bucket}/*'
# これは "arn:aws:s3:::bucket-name/*" という正しいARN形式になります
```

##### その他のスタック作成エラー
```bash
# スタックイベントを確認
aws cloudformation describe-stack-events \
  --stack-name your-project-dev \
  --query "StackEvents[?ResourceStatus=='CREATE_FAILED']"

# スタックの削除と再作成
aws cloudformation delete-stack --stack-name your-project-dev
# 削除完了を待つ
aws cloudformation wait stack-delete-complete --stack-name your-project-dev
# 再作成
./deploy-cloudformation.sh create your-project-dev
```

#### 2. アプリケーションレイアウトの問題

##### サイドバーとメインコンテンツエリアの配置ずれ

アプリケーションのダッシュボード画面でサイドバーとメインコンテンツが正しく配置されない場合の解決方法：

**問題の症状**:
- サイドバーが表示されているが、メインコンテンツが右側にずれて表示される
- デスクトップ表示でサイドバーとコンテンツエリアが重なる、または隙間が空く

**問題の原因**:
AppLayoutコンポーネントのサイドバー設定で `lg:static lg:inset-0` が使われている場合、Tailwind CSSのレイアウト競合が発生します。

**解決方法**:
`src/components/app/layout/AppLayout.tsx` を以下のように修正してください：

```tsx
// ❌ 問題のあるコード
<div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
  isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
} lg:static lg:inset-0`}>

// ✅ 修正されたコード  
<div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
  isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
}`}>
```

**修正のポイント**:
- `lg:static lg:inset-0` クラスを削除
- サイドバーを常に `fixed` 位置に保持
- メインコンテンツエリアの `lg:ml-64`（左マージン256px）とサイドバー幅 `w-64` が正確に一致するように調整

#### 3. S3アップロードエラー
```bash
# バケットの存在確認
aws s3 ls s3://your-bucket-name

# 権限確認
aws s3api get-bucket-policy --bucket your-bucket-name

# アップロード再試行
aws s3 sync dist/ s3://your-bucket-name --delete --debug
```

#### 4. CloudFrontアクセスエラー
```bash
# Distribution状態確認
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID

# Origin Access Control確認
aws cloudfront get-origin-access-control --id YOUR_OAC_ID

# キャッシュ無効化の状態確認
aws cloudfront get-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --id YOUR_INVALIDATION_ID
```

## 監視とメンテナンス

### CloudWatch監視
- CloudFrontメトリクス
  - リクエスト数
  - エラー率（4xx/5xx）
  - キャッシュヒット率
- S3メトリクス
  - バケットサイズ
  - リクエスト数

### コスト管理
- CloudFront使用量の監視
- S3ストレージコストの確認
- データ転送料の追跡

### 定期メンテナンス
- 依存関係の更新（月次）
- セキュリティパッチの適用
- パフォーマンス指標のレビュー
- バックアップの確認

## 開発環境

### ローカル開発
```bash
# 開発サーバー起動
npm run dev

# http://localhost:3000 でアクセス
```

### テスト実行
```bash
# ユニットテスト
npm run test

# E2Eテスト
npm run test:e2e

# カバレッジレポート
npm run test:coverage
```

### リンター/フォーマッター
```bash
# ESLint実行
npm run lint

# Prettier実行
npm run format
```