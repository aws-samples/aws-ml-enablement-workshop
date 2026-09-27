# 統合 React アプリテンプレート

ランディングページ（`/`）とアプリ本体（`/app`）を 1 つの React プロジェクトで管理するワークショップ用のテンプレートです。MLEW Tracker による計測が組み込まれており、AWS（S3 + CloudFront）へ静的サイトとしてデプロイできます。

このディレクトリをコピーして自分のモックアプリを作ってください。デプロイの詳細や、プロジェクト固有の変更箇所の一覧は [デプロイメントガイド](/yourwork/template/DEPLOYMENT_GUIDE.md) を参照してください。

## 技術スタック

`package.json` に記載されているバージョンです。

| 用途 | ライブラリ | バージョン |
| --- | --- | --- |
| UI | React / React DOM | 19.2.4 |
| 型 | TypeScript | 5.9.3 |
| ビルド | Vite | 7.3.3 |
| ルーティング | React Router | 7.12.0 |
| スタイル | Tailwind CSS（`@tailwindcss/vite` プラグイン） | 4.1.13 |
| アニメーション | Framer Motion | 12.23.26 |
| アイコン | lucide-react | 0.544.0 |
| スクロール検知 | react-intersection-observer | 9.16.0 |

- Tailwind CSS は v4 の CSS-first 構成です。`tailwind.config.js` と `postcss.config.js` はありません。カラーやアニメーションは `src/styles/globals.css` の `@theme {}` ブロックで定義します。
- `vite.config.ts` で `@` を `src/` のエイリアスに設定しています（例 : `import { getAppUrl } from '@/config/appUrl'`）。
- リンタ・フォーマッタは ESLint（`eslint.config.js`）と Prettier です。

## 前提

- Node.js 20 以上、npm 10 以上を推奨します（`package.json` の `engines` は Node 18 以上と書かれていますが、Vite 7 系は 20 以上が必要です）。動作確認は Node 24.13.0 / npm 11.6.2 で実施しています。
- デプロイする場合は AWS CLI v2 と、S3 / CloudFront / CloudFormation を操作できる権限が必要です。

## セットアップとローカル起動

```bash
cd yourwork/template/app

# 依存関係のインストール
npm install

# 開発サーバー起動（http://localhost:3000 が自動で開きます）
npm run dev
```

ビルドと、ビルド結果のローカル確認は次のとおりです。

```bash
# 型チェック + プロダクションビルド（出力先は dist/）
npm run build

# dist/ をローカルで配信して確認（http://localhost:4173）
npm run preview
```

## ディレクトリ構成

実際に存在するファイルのみを記載しています。

```
app/
├── index.html                  # MLEW Tracker SDK の読み込みと初期化（要編集）
├── cloudformation.yaml         # S3 + CloudFront のインフラ定義
├── vite.config.ts              # Vite 設定（@ エイリアス、チャンク分割、ポート 3000）
├── eslint.config.js
├── tsconfig.json / tsconfig.node.json
└── src/
    ├── main.tsx                # エントリポイント
    ├── App.tsx                 # ルーターのマウント
    ├── routes/index.tsx        # ルーティング定義（lazy import によるコード分割）
    ├── pages/
    │   ├── LandingPage.tsx     # ランディングページ
    │   └── AppPage.tsx         # アプリ本体
    ├── components/
    │   ├── app/HomePage.tsx    # アプリ側の画面
    │   ├── landing/layout/     # Header / Footer
    │   ├── landing/sections/   # Hero / Features / HowItWorks / Pricing / Testimonials / Contact
    │   └── common/             # LoadingSpinner
    ├── config/appUrl.ts        # アプリ本体の URL 解決（VITE_APP_URL）
    ├── services/mlewTracker.ts # Tracker 呼び出しのラッパー
    ├── styles/globals.css      # Tailwind の読み込みとテーマ定義
    └── types/index.ts
```

## ルーティング

`src/routes/index.tsx` で定義しています。

- `/` : ランディングページ
- `/app/*` : アプリ本体
- 上記以外 : `/` へリダイレクト

ランディングページの CTA は `src/config/appUrl.ts` の `getAppUrl()` が返す URL に遷移します。環境変数 `VITE_APP_URL` が設定されていればその URL へ、未設定なら同じアプリ内の `/app` へ遷移します。アプリ本体を別ホストに置く場合だけ `VITE_APP_URL` をビルド時に設定してください。

## MLEW Tracker の設定（コピーしたら必ず置き換える）

`index.html` に SDK の読み込みと初期化コードが入っていますが、**値はすべてダミーのプレースホルダー**です。そのままではイベントが送信されません。ワークショップの担当者から受け取った値に置き換えてください。

| 箇所 | 現在の値（ダミー） | 置き換える内容 |
| --- | --- | --- |
| `<script src="...">` | `https://{ここに正しいURLを設定}.cloudfront.net/tracker-sdk.js` | 配布された SDK の URL |
| `apiEndpoint` | `https://api123456.execute-api.us-west-2.amazonaws.com/dev/` | Tracker API のエンドポイント |
| `apiKey` | `abcd1234efgh5678ijkl9012mnop3456qrst7890` | 発行された API キー |
| `applicationId` / `applicationName` | `unified-react-app` / `Unified React App Template` | 自分のアプリの ID と名前 |

補足 :

- SDK は必ず外部から読み込みます。自作の実装に差し替えないでください。詳細は [MLEW Tracker 導入ガイド](/yourwork/template/TRANCKER_INTEGRATION_GUIDE.md) を参照してください。
- 利用者単位で指標を出すため、`index.html` の `getVisitorId()` が localStorage に保存する訪問者 ID を `setUserId()` に渡しています。
- アプリ側のコードからは `src/services/mlewTracker.ts` 経由で `trackClick` / `trackView` を呼びます。SDK 読み込み前のイベントはキューに入り、接続後に送信されます。
- `apiKey` はビルド成果物に含まれます。ワークショップで発行されたキー以外を書かないでください。

## AWS へのデプロイ

`cloudformation.yaml` で S3 バケットと CloudFront ディストリビューション（OAC 経由、SPA 用の 404/403 → `index.html` 書き換え、セキュリティヘッダー付き）を作成し、`dist/` を S3 へ同期します。

```bash
# 1. ビルド
npm run build

# 2. スタックの作成（ProjectName と Environment は自分の値に変更）
aws cloudformation create-stack \
  --stack-name your-project-dev \
  --template-body file://cloudformation.yaml \
  --parameters \
    ParameterKey=ProjectName,ParameterValue=your-project \
    ParameterKey=Environment,ParameterValue=dev \
  --capabilities CAPABILITY_IAM

aws cloudformation wait stack-create-complete --stack-name your-project-dev

# 3. 出力から S3 バケット名と Distribution ID を取得
BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name your-project-dev \
  --query "Stacks[0].Outputs[?OutputKey=='S3BucketName'].OutputValue" --output text)
DISTRIBUTION_ID=$(aws cloudformation describe-stacks --stack-name your-project-dev \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" --output text)

# 4. アップロードとキャッシュ無効化
aws s3 sync dist/ s3://${BUCKET_NAME} --delete
aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths "/*"

# 5. 公開 URL を確認
aws cloudformation describe-stacks --stack-name your-project-dev \
  --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" --output text
```

2 回目以降のインフラ更新は `create-stack` を `update-stack` に置き換えます。アプリだけ更新する場合は 1・3・4 のみで十分です。

`BUCKET_NAME` と `DISTRIBUTION_ID` を環境変数に入れておけば、ビルドから同期・無効化までを `npm run deploy` でまとめて実行できます。

```bash
export S3_BUCKET_NAME=${BUCKET_NAME}
export CLOUDFRONT_DISTRIBUTION_ID=${DISTRIBUTION_ID}
npm run deploy
```

パラメータとトラブルシューティングの補足 :

- `ProjectName` の既定値は `unified-react-app`、`Environment` の既定値は `prod`（`dev` / `staging` / `prod` から選択）です。バケット名は `${ProjectName}-${Environment}-${AWS::AccountId}` になります。
- `DomainName` パラメータは定義されているだけで、テンプレート内では使われていません。独自ドメインを使うには `cloudformation.yaml` の追記が必要です。
- CloudFront のキャッシュは開発しやすさを優先して無効（TTL 0、CachingDisabled ポリシー）に設定されています。本番運用ではキャッシュポリシーを見直してください。
- スタック作成が失敗したときの調べ方は [デプロイメントガイド](/yourwork/template/DEPLOYMENT_GUIDE.md) のトラブルシューティングにまとめています。

## npm スクリプト

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動（ポート 3000、ブラウザ自動オープン） |
| `npm run build` | `tsc` による型チェック後に `dist/` を生成 |
| `npm run preview` | `dist/` をローカル配信（ポート 4173） |
| `npm run typecheck` | 型チェックのみ（`tsc --noEmit`） |
| `npm run lint` / `npm run lint:fix` | ESLint（警告 20 件まで許容する設定） |
| `npm run format` | Prettier で `src/` を上書き整形。初期状態でも差分が出るファイルがあるため、実行すると多くのファイルが変更されます |
| `npm run deploy` | ビルドして S3 同期と CloudFront 無効化（要 `S3_BUCKET_NAME`・`CLOUDFRONT_DISTRIBUTION_ID`） |
| `npm run test` / `test:ui` / `test:coverage` / `test:e2e` / `test:e2e:ui` | 定義はあるが**テストは同梱されていない**（下記参照） |
| `npm run analyze` | `vite-bundle-analyzer` を `npx` で取得して実行（依存に含まれないため未検証） |

## このテンプレートの実態（ハマりやすい点）

- **テストは同梱されていません**。`vitest` / `@playwright/test` / Testing Library / `msw` / `jsdom` は devDependencies に入っていますが、テストファイルも `vitest.config.*` / `playwright.config.*` もありません。`npm run test` は「No test files found」、`npm run test:e2e` は「No tests found」で終了します（いずれも終了コード 1）。テストを書く場合は設定ファイルの追加から始めてください。
- **使われていない依存があります**。`@headlessui/react`、`@heroicons/react`、`zustand` は `src/` と `index.html` から参照されていません。使わないなら削除してかまいません（アイコンは `lucide-react` を、状態管理は React のフックを使っています）。
- **`.env` は不要です**。コード内で参照している環境変数は `VITE_APP_URL` だけです（`src/config/appUrl.ts`）。`VITE_API_URL` や `VITE_ANALYTICS_ID` を読む処理はありません。`S3_BUCKET_NAME` と `CLOUDFRONT_DISTRIBUTION_ID` は `npm run deploy` 用のシェル環境変数で、`.env` からは読み込まれません。
- **`npm run lint` は警告が出た状態で通ります**。初期状態で `no-explicit-any` の警告が 7 件あります（エラーは 0 件）。
- コピー後に変更し忘れやすい箇所 : `index.html` の `<title>` と `description`、`package.json` の `name` / `description` / `author`、`cloudformation.yaml` の `ProjectName`、ランディングページ各セクションの文面。

## 関連ドキュメント

- [デプロイメントガイド](/yourwork/template/DEPLOYMENT_GUIDE.md) : 変更箇所の一覧、セキュリティ設定、トラブルシューティング
- [MLEW Tracker 導入ガイド](/yourwork/template/TRANCKER_INTEGRATION_GUIDE.md) : SDK の使い方、ユーザー ID の設計、よくあるエラー
