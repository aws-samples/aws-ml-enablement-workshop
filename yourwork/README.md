# ML Enablement Workshop 当日のガイド

本文書は ML Enablement Workshop 当日に使用します。本文章に沿って進める前に Day0 を終えていること、Day0 で案内された事前準備を完了していることの 2 点を確認してください。

* [Day0 のガイド](/docs/organizer/day0.md)

ML Enablement Workshop の主催者は、Day1 実践編・Day2 改善編を始める前に参加者が本文章を開いていることを確認してください。Day1 と Day2 で進行の流れは大きく変わらないため、このページを両日で使う形で構いません。主催者向けの注意点・留意事項は主催者向けガイドを参照ください。

* 主催者向け
   * [Day1 実践編のガイド](/docs/organizer/day1.md)
   * [Day2 改善編のガイド](/docs/organizer/day2.md)

ワークを進める際に、`yourwork` のディレクトリに移っているか確認ください。

```
cd aws-ml-enablement-workshop/yourwork
pwd
# /your/working/directory/aws-ml-enablement-workshop/yourwork
```

## Listen

ワークでは次のプロンプトを使用してください。Amazon Q Developer CLI などの生成 AI ツールに次のプロンプトを与えます。

> [!IMPORTANT]
> 事前に、今回検討する顧客についてまとめたスライドが `customer.png` として `yourwork/discovery` ディレクトリに保存されているか確認ください。

> あなたはユーザーリサーチの専門家で、新規企画のための顧客調査を担当しています。`discovery/customer.png` に定義された顧客が目的を達成するために取った行動、行動に要したリソース(金額や時間など)、その時の感情を詳細に書き出し表にまとめ `discovery/README.md` の Listen セクションに記載してください。

途中で、ツールの利用などについて許可を求められた際はツールの案内に従い許可してください (Amazon Q Developer なら `y` を実行します)。

## Define

## Invent

## Refine


## 概要

このプロジェクトは、生成 AI を使用して自動的に LP およびアプリケーションを作成するためのフレームワークです。
Amazon Q Developer CLI を活用し、プロンプトベースでアプリケーション開発を自動化します。

## プロジェクト構成

```
yourwork
├── .amazonq/                  # カスタムエージェント等、Q Developer CLI 用設定ファイルディレクトリ
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

### (Optional) 画像生成用

こちらは Optional ですが、アプリケーションを自動生成する際に、モックアップ画像等を生成する際に画像生成モデルを利用することが可能です。
利用する場合は、以下の blog を参考に、画像生成モデルである Amazon Nova Canvas のモデルアクセスを有効化してください。
※ 有効化するリージョンは `us-east-1` です

**参考ドキュメント**: [Amazon Nova Canvas を使用したテキストからの画像生成の基本](https://aws.amazon.com/jp/blogs/news/text-to-image-basics-with-amazon-nova-canvas/)


## 使用方法

### 1. ディレクトリの移動

以下のコマンドを実行し、`mock` ディレクトリに移動します。

```
cd ./aws-ml-enablement-workshop/mock
```

### 2. Amazon Q Developer CLI の起動

以下のコマンドで Amazon Q Developer CLI のカスタムエージェントを起動します。

```
q chat --agent mock-builder
```

### 3. カスタムエージェントの実行

`こんにちは` や `アプリケーションを作成したい` など適当な言葉を入力いただくと、カスタムエージェントが実行されます。
カスタムエージェントは実装を開始する前に、以下の２つの質問を順番にユーザーに確認します。

* 実装したいアプリケーションの詳細
* （Option)トラッキング用エンドポイント等の情報

**実装したいアプリケーションの詳細については、Refine で作成した PR/FAQ を与えてください**。 
上記の質問に順番に回答すると、アプリケーションが自動的に実装され、CloudFront + S3 でホスティングされます。

### 4. ホスティングしたアプリケーションの削除

AWS にデプロイしたアプリケーションを削除したい場合は、Q Developer CLI に、`/product/ ディレクトリを参照し、デプロイしたアプリケーションを削除したい` と伝えてください。
各種リソースの削除が行われます。

## Test/Iterate
