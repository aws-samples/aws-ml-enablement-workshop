# ML Enablement Workshop 生成 AI 環境事前準備

ML Enablement Workshop で開発者 / データサイエンティスト担当の方は、**チーム全員が先生 AI を扱えるように**下記の環境セットアップをワークショップ開始前に完了してください。環境セットアップは、[Amazon Q Developer CLI](https://docs.aws.amazon.com/ja_jp/amazonq/latest/qdeveloper-ug/command-line.html) を想定しています。

## AWS 環境の事前準備

### IAM ユーザーの作成
- Administrator 権限を保有する IAM ユーザーを人数分発行し、認証情報（アクセスキー、シークレットキー）を準備する
  - ※最小権限の法則上好ましくないため、あくまで一時的な対応としてください。すでに参加者に IAM ユーザーをはじめとした AWS にアクセス可能なプロファイル等が払い出されている場合この手順は不要ですが、モックの作成が可能なことを事前に確認ください

### Amazon Q Developer Pro のライセンス準備
- Amazon Q Developer Pro のライセンスを人数分準備する

## 端末でのセットアップ

### 1. Amazon Q Developer CLI のインストール

Amazon Q Developer CLIは、コマンドラインでAI支援によるコード生成、チャット、コマンド自動補完を提供するツールです。

- Windows 以外: [公式ドキュメント](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/command-line-installing.html)
- Windows の場合: [Qiita記事](https://qiita.com/nagisa_53/items/ab5ef9a8d799ea964e1e)

### 2. AWS CLI のインストールと設定

[AWS CLI インストール方法](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/getting-started-install.html)

```bash
# AWS CLI の設定（IAMユーザーの認証情報を入力）
aws configure

# 以下の項目を順番に入力：
# AWS Access Key ID [None]: [IAMユーザーのアクセスキーID]
# AWS Secret Access Key [None]: [IAMユーザーのシークレットアクセスキー]
# Default region name [None]: ap-northeast-1
# Default output format [None]: json

# 設定確認
aws sts get-caller-identity
```

### 3. Node.js と npm のインストール

[Node.js ダウンロード](https://nodejs.org/ja/download) から "ビルド済みのNode.js" をダウンロード、インストール。

```bash
# Node.js のバージョン確認（v18.0.0 以上必須）
node --version

# npm のバージョン確認（v8.0.0 以上必須）
npm --version
```

### 4. Git のインストール (未インストールであれば) 

https://git-scm.com/downloads

### 5. Amazon Q Developer CLI へのログイン

AWS コンソールから、Amazon Q Developer を検索しサービスページにアクセス。Start URL とリージョンを確認。
![Amazon Q](/docs/organizer/assets/day0/amazon-q-developer.png)

```bash
# Q Developer Pro にログイン
q login

# Select login method => Use with Pro license
# Enter Start URL => AWS コンソールで確認した値
# Enter Region => AWS コンソールで確認した Region
# 表示される URL にアクセスし、Amazon Q Developer の利用を許可

# 認証後、確認
q chat
```

### 5. モックアプリケーションの動作確認

```bash
# 1. zip ファイルを解凍
git clone https://github.com/aws-samples/aws-ml-enablement-workshop.git

# 2. mock ディレクトリへ移動
cd aws-ml-enablement-workshop/mock

# 3. Q Developer CLI のカスタムエージェントを起動
q chat --agent mock-builder

# 4. 「アプリを作りたい」など適当な指示を入力
# 5. アプリケーションの詳細を入力
# 6. Tracker情報は「なし」と回答
# 7. 20~30分待機
```

### 6. 作成されたモックアプリケーションの削除

- 「作成したアプリケーションを削除して」とカスタムエージェントに指示
