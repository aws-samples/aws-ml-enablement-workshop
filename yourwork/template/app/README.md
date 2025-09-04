# Unified React Application

統合された React アプリケーション - ランディングページとアプリケーションを1つのプロジェクトで管理

## 📁 プロジェクト構造

```
unified/
├── src/
│   ├── components/
│   │   ├── app/           # アプリケーション用コンポーネント
│   │   ├── landing/       # ランディングページ用コンポーネント
│   │   │   ├── sections/  # LP の各セクション
│   │   │   └── layout/    # LP のレイアウト（ヘッダー、フッター）
│   │   └── common/        # 共通コンポーネント
│   ├── pages/
│   │   ├── LandingPage.tsx # ランディングページ
│   │   └── AppPage.tsx     # アプリケーションページ
│   ├── routes/
│   │   └── index.tsx       # ルーティング設定
│   ├── hooks/              # カスタムフック
│   ├── services/           # API サービス
│   ├── styles/             # グローバルスタイル
│   ├── types/              # TypeScript 型定義
│   └── App.tsx             # メインアプリコンポーネント
```

## 🚀 ルーティング

- **`/`** - ランディングページ（製品紹介、機能説明、価格など）
- **`/app`** - アプリケーション（ログイン後のメイン機能）
- **`/app/*`** - アプリケーション内の各ページ

## 📦 インストール

```bash
npm install
```

## 🛠️ 開発

```bash
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

## 🏗️ ビルド

```bash
npm run build
```

## 🚢 デプロイ

```bash
# 環境変数を設定
export S3_BUCKET_NAME=your-bucket-name
export CLOUDFRONT_DISTRIBUTION_ID=your-distribution-id

# デプロイ実行
npm run deploy
```

または

```bash
./deploy.sh
```

## 🧪 テスト

```bash
# ユニットテスト
npm run test

# E2E テスト
npm run test:e2e

# カバレッジ
npm run test:coverage
```

## ⚙️ 環境変数

`.env` ファイルを作成して設定：

```env
# AWS 設定
S3_BUCKET_NAME=your-bucket-name
CLOUDFRONT_DISTRIBUTION_ID=your-distribution-id
AWS_REGION=us-east-1

# アプリケーション設定
VITE_API_URL=https://api.example.com
VITE_ANALYTICS_ID=your-analytics-id
```

## 🔧 技術スタック

- **React 18** - UI フレームワーク
- **TypeScript 5** - 型安全性
- **Vite 6** - ビルドツール
- **React Router v6** - ルーティング
- **Tailwind CSS 3** - スタイリング
- **Framer Motion** - アニメーション
- **Zustand** - 状態管理
- **ESLint 9** - コード品質管理

## 📝 特徴

### コード分割
- ランディングページとアプリケーションは別々にロード
- Lazy loading でパフォーマンス最適化
- 各ルートごとに必要なリソースのみロード

### 共通コンポーネント
- LP とアプリで共通利用可能なコンポーネント
- 統一されたデザインシステム
- 再利用可能な UI パーツ