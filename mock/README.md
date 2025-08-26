# AI アプリケーション自動生成フレームワーク

## 概要

このプロジェクトは、生成 AI を使用して自動的に LP およびアプリケーションを作成するためのフレームワークです。
Amazon Q Developer CLI を活用し、プロンプトベースでアプリケーション開発を自動化します。

## プロジェクト構成

```
├── prompt/                    # プロンプトファイルディレクトリ
│   └── prompt.md             # アプリケーション仕様記述ファイル
├── template/                  # アプリケーションテンプレート
└── product/                  # 生成されるアプリケーション（Q Developer CLI により作成されます)
```

## 必要な環境

### AI アプリケーション生成用

#### Amazon Q Developer CLI

Amazon Q Developer CLIは、コマンドラインでAI支援によるコード生成、チャット、コマンド自動補完を提供するツールです。以下のドキュメントを参考に Amazon Q Developer CLI をインストールしてください。
※ Windows の場合は WSL2 のインストールが必要となります

**参考ドキュメント**: [Amazon Q Developer CLI インストールガイド](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/command-line-installing.html)

#### AWS CLI
 
AWS Command Line Interface（AWS CLI）は、コマンドラインからAWSサービスを操作するための公式ツールです。

**参考ドキュメント**: [AWS CLI最新バージョンのインストール](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/getting-started-install.html)

**AWS CLIの初期設定**

AWS CLIを使用するには、AWSアカウントとアクセスキーが必要です。

```bash
# 1. AWS CLI の設定
aws configure

# 以下の項目を順番に入力してください：
# AWS Access Key ID [None]: （アクセスキーIDを入力）
# AWS Secret Access Key [None]: （シークレットアクセスキーを入力）
# Default region name [None]: ap-northeast-1（推奨）
# Default output format [None]: json（推奨）

# 3. 設定確認
aws sts get-caller-identity
# 正常に設定されていれば、ユーザー情報が JSON 形式で表示されます
```

### テンプレートアプリのビルド用

#### Node.js と npm

以下のドキュメントを参考に、Node.js と npm をインストールしてください。

**参考ドキュメント**: [Node.js公式ダウンロードページ](https://nodejs.org/ja)

**バージョン確認**
```bash
# Node.js のバージョンを確認（v18.0.0 以上が必要）
node --version
# 期待される出力例: v18.20.8

# npm のバージョンを確認（v8.0.0 以上が必要）
npm --version  
# 期待される出力例: 10.8.2
```

## 使用方法

### 1. プロンプトファイルの準備

`./prompt/prompt.md` ファイルを編集し、以下の項目を記載します。

#### アプリケーション仕様の記載
```markdown
<application_requirements>
{ここに作成したいアプリケーションの詳細を入力してください}
</application_requirements>
```

#### トラッカー情報の設定（効果測定用）
```markdown
<tracker_configuration>
{以下にデプロイしたMLEWトラッカーのエンドポイント情報を入力してください}
- **API Endpoint**: `https://xxxxxxxx.execute-api.us-west-2.amazonaws.com/dev/`
- **API Key**: dummyapikey
- **Dashboard URL**: `https://xxxxxxxx.cloudfront.net`
- **Tracker SDK URL** : `https://xxxxxxxx.cloudfront.net/tracker-sdk.js`
</tracker_configuration>
```

**注意**: トラッカー情報は効果測定のために必要です。実際のエンドポイント情報に書き換えてから使用してください。

### 2. Amazon Q Developer CLI の起動

Amazon Q Developer CLI を起動し、準備したプロンプトをコピーし、指示として入力します。

### 3. アプリケーションの自動生成

AI がプロンプトの内容を解析し、指定された要件に基づいてアプリケーションを自動的に生成します。

## 注意事項

- プロンプトファイルの `<application_requirements>` タグ内に、具体的で明確なアプリケーション仕様を記載してください
- 生成されるアプリケーションの品質は、プロンプトの詳細度と明確さに依存します