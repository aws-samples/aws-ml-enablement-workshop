# ML Enablement Workshop 生成 AI 環境事前準備

ML Enablement Workshop で開発者 / データサイエンティスト担当の方は、**チーム全員が生成 AI を扱えるように**下記の環境セットアップをワークショップ開始前に完了してください。環境セットアップは、[Kiro CLI](https://kiro.dev/docs/cli/installation/) を想定しています。

なお、Mock の生成以外は [GenU : Generative AI Use Cases](https://aws-samples.github.io/generative-ai-use-cases/en/) で行うこともできます。GenU を使用する場合は、[ワークショップ用のユースケース](/docs/organizer/assets/day0/ML_Enablement_Workshop_GenU.json) をダウンロードし、[ユースケースビルダーにインポート](https://aws-samples.github.io/sample-one-click-generative-ai-solutions/solutions/generative-ai-use-cases-ready-to-use/) してください。

## AWS 環境の事前準備

### IAM ユーザーの作成
- Administrator 権限を保有する IAM ユーザーを人数分発行し、認証情報（アクセスキー、シークレットキー）を準備する
  - ※最小権限の法則上好ましくないため、あくまで一時的な対応としてください。すでに参加者に IAM ユーザーをはじめとした AWS にアクセス可能なプロファイル等が払い出されている場合この手順は不要ですが、モックの作成が可能なことを事前に確認ください

### サブスクリプションの用意
- Kiro、もしくは Amazon Q Developer のサブスクリプションを人数分用意します

※ Free/Individual のサブスクリプションで進めて頂くことができます。ただ、この場合データの取り扱いについて十分確認・検討の上でご判断ください。

* [Kiro 導入ガイド：始める前に知っておくべきすべてのこと](https://aws.amazon.com/jp/blogs/news/kiroweeeeeeek-in-japan-day-1-implementation-guide/)

## 端末でのセットアップ

### 1. Kiro CLI のインストール

Kiro CLIは、コマンドラインでAI支援によるコード生成、チャット、コマンド自動補完を提供するツールです。

- Windows 以外: [AWS Blog](https://aws.amazon.com/jp/blogs/news/introducing-kiro-cli/)
- Windows の場合: WSL を設定し、Ubuntu としてセットアップします。Amazon Q Developer の設定をご参照ください : [Qiita記事](https://qiita.com/nagisa_53/items/ab5ef9a8d799ea964e1e)

### 2. AWS CLI のインストールと設定

[AWS CLI インストール方法](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/getting-started-install.html)

```bash
# AWS CLI の設定（ブラウザで認証）
aws login

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

### 5. Kiro CLI へのログイン

AWS コンソールから、Amazon Q Developer / Kiro を検索しサービスページにアクセス。Start URL とリージョンを確認。

**Amazon Q Developer:**
![Amazon Q Developer](/docs/organizer/assets/day0/amazon-q-developer.png)

**Kiro:**
![Kiro](/docs/organizer/assets/day0/kiro.png)

```bash
# Kiro にログイン
kiro-cli login

# Select login method => Use with IDC Account (Free の場合 Builder ID)
# Enter Start URL => AWS コンソールで確認した値
# Enter Region => AWS コンソールで確認した Region
# 表示される URL にアクセスし、認証・Kiro のアクセスを許可

# 認証後、確認
kiro-cli
```

### (Optional) 画像生成用

こちらは Optional ですが、アプリケーションを自動生成する際に、モックアップ画像等を生成する際に画像生成モデルを利用することが可能です。
利用する場合は、以下の blog を参考に、画像生成モデルである Amazon Nova Canvas のモデルアクセスを有効化してください。
※ 有効化するリージョンは `us-east-1` です

**参考ドキュメント**: [Amazon Nova Canvas を使用したテキストからの画像生成の基本](https://aws.amazon.com/jp/blogs/news/text-to-image-basics-with-amazon-nova-canvas/)


### 5. モックアプリケーションの動作確認

```bash
# 1. zip ファイルを解凍
git clone https://github.com/aws-samples/aws-ml-enablement-workshop.git

# 2. mock を作成するディレクトリへ移動
cd aws-ml-enablement-workshop/yourwork

# 3. Q Developer CLI のカスタムエージェントを起動
kiro-cli --agent mock-builder

# 4. 「アプリを作りたい」など適当な指示を入力
# 5. アプリケーションの詳細を入力
# 6. Tracker情報は「なし」と回答
# 7. 20~30分待機
```

### 6. 作成されたモックアプリケーションの削除

- 「作成したアプリケーションを削除して」とカスタムエージェントに指示
