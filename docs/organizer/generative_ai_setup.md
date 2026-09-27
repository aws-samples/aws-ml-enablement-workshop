# ML Enablement Workshop 生成 AI 環境事前準備

ML Enablement Workshop で開発者 / データサイエンティスト担当の方は、**チーム全員が生成 AI を扱えるように**下記の環境セットアップをワークショップ開始前に完了してください。

なお、Mock の生成以外は [GenU : Generative AI Use Cases](https://aws-samples.github.io/generative-ai-use-cases/en/) で行うこともできます。GenU を使用する場合は、[ワークショップ用のユースケース](/docs/organizer/assets/day0/ML_Enablement_Workshop_GenU.json) をダウンロードし、[ユースケースビルダーにインポート](https://aws-samples.github.io/sample-one-click-generative-ai-solutions/solutions/generative-ai-use-cases-ready-to-use/) してください。

## AWS 環境の事前準備

### IAM ユーザーの作成
- Administrator 権限を保有する IAM ユーザーを人数分発行し、認証情報（アクセスキー、シークレットキー）を準備する
  - ※最小権限の法則上好ましくないため、あくまで一時的な対応としてください。すでに参加者に IAM ユーザーをはじめとした AWS にアクセス可能なプロファイル等が払い出されている場合この手順は不要ですが、モックの作成が可能なことを事前に確認ください

### サブスクリプションの用意
- Kiro、もしくは Amazon Q Developer のサブスクリプションを人数分用意します

※ Free/Individual のサブスクリプションで進めて頂くことができます。ただ、この場合データの取り扱いについて十分確認・検討の上でご判断ください。

* [Kiro 導入ガイド：始める前に知っておくべきすべてのこと](https://aws.amazon.com/jp/blogs/news/kiroweeeeeeek-in-japan-day-1-implementation-guide/)

## 端末でのセットアップ（共通）

### 1. AWS CLI のインストールと設定

[AWS CLI インストール方法](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/getting-started-install.html)

```bash
# AWS CLI の設定（ブラウザで認証）
aws login

# 設定確認
aws sts get-caller-identity
```

### 2. Node.js と npm のインストール

[Node.js ダウンロード](https://nodejs.org/ja/download) から "ビルド済みのNode.js" をダウンロード、インストール。

```bash
# Node.js のバージョン確認（v18.0.0 以上必須）
node --version

# npm のバージョン確認（v8.0.0 以上必須）
npm --version
```

### 3. uv（Python パッケージマネージャー）のインストール

[uv インストールガイド](https://docs.astral.sh/uv/getting-started/installation/)

```bash
# インストール（pip を使う場合）
pip install uv

# または macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# インストール確認
uv --version

# 依存関係のインストール（aws-ml-enablement-workshop ディレクトリで実行）
cd aws-ml-enablement-workshop
uv sync
```

### 4. Git のインストール (未インストールであれば) 

https://git-scm.com/downloads

## 利用する AI コーディングツールの選択

モックの作成には、下記の方法 A 〜 D のいずれかを使います。**どれか 1 つが利用できればワークは完走できます**ので、複数を用意する必要はありません。
組織のセキュリティポリシーや、すでに契約しているサブスクリプション・ライセンスに合わせて選んでください。

## 方法 A : Kiro（GUI）でワークショップを進める

Kiro GUI は仕様駆動開発をサポートする AI Coding エディタです。

1. [Kiro](https://kiro.dev) をインストール
2. インストール後、Kiro Subscription の情報を使用しログインして使用します ([セットアップ参考動画](https://youtu.be/_qmKY_9qtaU?si=StEuV9e2UjxURSEg))
3. チャットで応答が返ってくることを確認

## 方法 B : Kiro CLI でワークショップを進める

Kiro CLIは、コマンドラインでAI支援によるコード生成、チャット、コマンド自動補完を提供するツールです。

- [Kiro CLI](https://kiro.dev/docs/cli/installation/) をインストール
- Kiro CLI でログイン

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

## 方法 C : Claude Code でワークショップを進める

Claude Code は、ターミナルで動作する Anthropic のコーディングエージェントです。

- [Claude Code のセットアップ](https://code.claude.com/docs/en/setup) に従ってインストール（対応 OS と OS ごとのインストール方法が記載されています）

```bash
# インストールの確認
claude --version

# インストール状況と設定の診断
claude doctor

# 起動（初回はブラウザでのログインが案内されます）
claude

# 後からアカウントを切り替える場合は、セッション内で /login
```

> [!IMPORTANT]
> Claude Code の利用には Pro / Max / Team / Enterprise のいずれか、または Claude Console のアカウントが必要です。無料の claude.ai プランは対象外です。詳細は [Quickstart](https://code.claude.com/docs/en/quickstart) を参照してください。

> [!TIP]
> **Amazon Bedrock 経由で利用することもできます。** AWS アカウントの認証情報をそのまま使えるため、AWS を前提に進める本ワークショップでは選択肢になります。
>
> 1. [Amazon Bedrock コンソール](https://console.aws.amazon.com/bedrock/) の Model catalog で Anthropic のモデルを選び、ユースケースフォームを送信してモデルアクセスを有効化する（AWS アカウントごとに 1 回）
> 2. `claude` を起動し、ログイン画面で **3rd-party platform** → **Amazon Bedrock** を選ぶ（すでにログイン済みの場合はセッション内で `/setup-bedrock`）
>
> ウィザードが AWS プロファイル・リージョン・利用するモデルを設定します。必要な IAM 権限（`bedrock:InvokeModel` 等）を含む詳細は [Claude Code on Amazon Bedrock](https://code.claude.com/docs/en/amazon-bedrock) を参照してください。

## 方法 D : OpenAI Codex CLI でワークショップを進める

OpenAI Codex CLI は、ターミナルで動作する OpenAI のコーディングエージェントです。

- [Codex CLI のドキュメント](https://learn.chatgpt.com/docs/codex/cli) に従ってインストール

```bash
# ログイン（ブラウザが開き、ChatGPT アカウントでサインインします）
codex login

# 認証方法の確認
codex login status

# ChatGPT アカウントの代わりに OpenAI API キーを使う場合
printenv OPENAI_API_KEY | codex login --with-api-key

# 起動
codex
```

> [!NOTE]
> どの ChatGPT プランで Codex を利用できるかは、公式ドキュメントの [認証オプション](https://learn.chatgpt.com/docs/auth) から確認してください。プランごとの対応状況は変更されるため、ここには記載しません。

## モデルについて

**各ツールの既定モデルで十分です。** 品質が足りないと感じた場合は、モデルを変えるより先に thinking / reasoning effort（思考にかける量）を上げてください。モデルの切り替えよりも結果に効きやすいレバーです。

具体的なモデル名やモデル ID はここには記載しません。世代交代が速く、書いた時点で古くなるためです。現在利用できるモデルは、各ツールのモデル選択機能で確認してください。

**参考ドキュメント**: [Choosing a model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)

### 7. モックアプリケーションの動作確認

```bash
# 1. zip ファイルを解凍
git clone https://github.com/aws-samples/aws-ml-enablement-workshop.git

# 2. mock を作成するディレクトリへ移動
cd aws-ml-enablement-workshop/yourwork

# 3. Kiro CLI のカスタムエージェントを起動
kiro-cli --agent mock-builder

# 4. 「アプリを作りたい」など適当な指示を入力
# 5. アプリケーションの詳細を入力
# 6. Tracker情報は「なし」と回答
# 7. 20~30分待機
```

方法 C / 方法 D を利用する場合は、上記の 3. を次のコマンドに置き換えてください（4. 以降は同じです）。

**方法 C : Claude Code**

```bash
# 3. Claude Code を起動
claude
```

`yourwork/CLAUDE.md` と `yourwork/AGENTS.md` が読み込まれた状態で起動します。`yourwork/.claude/skills/mock-builder/` にモック構築用の skill があるため、「アプリを作りたい」と依頼すればモック構築の手順に入ります（`/mock-builder` と明示的に呼び出すこともできます）。

**方法 D : OpenAI Codex CLI**

```bash
# 3. Codex CLI を起動
codex
```

`yourwork/AGENTS.md` が読み込まれた状態で起動します。「アプリを作りたい」と依頼し、作業の起点として `yourwork/prompt/prompt.md` を渡してください。

### 8. 作成されたモックアプリケーションの削除

- 「作成したアプリケーションを削除して」とカスタムエージェントに指示
