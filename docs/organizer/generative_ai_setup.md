# ML Enablement Workshop 生成 AI 環境事前準備

ML Enablement Workshop で開発者 / データサイエンティスト担当の方は、**チーム全員が生成 AI を扱えるように**下記の環境セットアップをワークショップ開始前に完了してください。

なお、モックの生成以外は [GenU : Generative AI Use Cases](https://aws-samples.github.io/generative-ai-use-cases/en/) で行うこともできます。GenU を使用する場合は、[ワークショップ用のユースケース](/docs/organizer/assets/day0/ML_Enablement_Workshop_GenU.json) をダウンロードし、[ユースケースビルダーにインポート](https://aws-samples.github.io/sample-one-click-generative-ai-solutions/solutions/generative-ai-use-cases-ready-to-use/) してください。

## 前提条件

- **OS**: macOS / Linux / Windows のいずれでも進められます。**Windows ではネイティブの PowerShell を使ってください**（WSL2 や Git Bash は不要です）。Kiro CLI と Codex CLI は、Windows では PowerShell でコマンドを実行します。このガイドと当日のガイドのコマンドは、注記がない限り PowerShell でもそのまま動く 1 行の形で書いています。
- **PowerShell の実行ポリシー（Windows）**: `npm` や `pnpm` の実行で「このシステムではスクリプトの実行が無効になっているため…」と表示された場合は、PowerShell で `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` を実行してから、PowerShell を開き直してください。
- **AWS アカウント**: モックの CloudFront 用の WAF は us-east-1 にしか作れないため、**us-east-1 が SCP（サービスコントロールポリシー）などで制限されていないこと**が必要です。確認方法は「1. AWS CLI のインストールと設定」にあります。
- **clone する場所（Windows）**: OneDrive の同期対象のフォルダー（「ドキュメント」「デスクトップ」など）を避け、`C:\mlew\` のような短いパスに clone してください。pnpm は大量のファイルとリンクを作るため、同期対象や長いパスではロック・遅延・パス長の問題が起きやすくなります。
- **ツールのバージョン**: Node.js 22.13 以上（推奨: 24 LTS）、uv 0.5.29 以上。pnpm を含む検証済みのバージョンは [`yourwork/AGENTS.md` の「検証済みバージョン」](/yourwork/AGENTS.md#検証済みバージョン) を参照してください。

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

```text
# AWS CLI の設定（ブラウザで認証）
aws login

# 設定確認
aws sts get-caller-identity

# us-east-1 が使えることの確認（数字が 1 つ出れば問題ありません。0 でも構いません。エラーになった場合だけ下の対処が必要です）
aws cloudformation list-stacks --region us-east-1 --max-items 1 --query "length(StackSummaries)" --output json
```

このコマンドは読み取りだけを確かめるので、作成や WAF だけを拒否する SCP は見つけられません。企業のアカウントでは、「6. 動作確認」でデプロイまで通して確かめてください。

最後のコマンドが `AccessDenied`（`explicit deny in a service control policy` など）で失敗する場合は、組織の SCP などで us-east-1 が制限されています。このままではモックをデプロイできないため、AWS アカウントの管理者に us-east-1 の利用（CloudFormation、WAF など）を許可してもらうか、制限のないアカウントを用意してください。

### 2. Node.js と npm のインストール

[Node.js ダウンロード](https://nodejs.org/ja/download) から "ビルド済みの Node.js" をダウンロード、インストール。**Node.js 22.13 以上（推奨: 24 LTS）** が必要です。モックが使う Nx は Node.js 20 に対応しておらず、npm での pnpm のインストールにも 22.13 以上が必要です。

```text
# Node.js のバージョン確認（v22.13.0 以上。推奨は v24 LTS）
node --version

# npm のバージョン確認（v8.0.0 以上必須）
npm --version
```

### 3. pnpm のインストール

モックは pnpm でワークスペースを作成・ビルドします（npm では依存をインストールできません）。バージョンは [`yourwork/AGENTS.md` の「検証済みバージョン」](/yourwork/AGENTS.md#検証済みバージョン) の pnpm と揃えます（下のコマンドの `12.4.1` も、表を更新したら合わせて直します）。

```text
# インストール
npm install -g pnpm@12.4.1

# インストール確認
pnpm --version
```

### 4. uv（Python パッケージマネージャー）のインストール

ワークショップの依存関係のほか、モックのビルド（infra の checkov を `uvx` で実行）にも使います。未インストールだとモックのビルドが失敗します。**uv 0.5.29 以上**が必要です。

インストール方法は OS によって異なります。ほかの方法は [uv インストールガイド](https://docs.astral.sh/uv/getting-started/installation/) を参照してください。

**macOS / Linux**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows（PowerShell）**

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

インストール後にターミナルを開き直し、次を実行します（ここからはどの OS でも同じです）。

```text
# インストール確認（0.5.29 以上）
uv --version

# 依存関係のインストール（aws-ml-enablement-workshop ディレクトリで実行）
cd aws-ml-enablement-workshop
uv sync
```

### 5. Git のインストール (未インストールであれば) 

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

```text
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

```text
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

```text
# ログイン（ブラウザが開き、ChatGPT アカウントでサインインします）
codex login

# 認証方法の確認
codex login status

# ChatGPT アカウントの代わりに OpenAI API キーを使う場合（環境変数 OPENAI_API_KEY にキーを設定済みの前提）
# macOS / Linux
printenv OPENAI_API_KEY | codex login --with-api-key
# Windows（PowerShell）
$env:OPENAI_API_KEY | codex login --with-api-key

# 起動
codex
```

> [!NOTE]
> どの ChatGPT プランで Codex を利用できるかは、公式ドキュメントの [認証オプション](https://learn.chatgpt.com/docs/auth) から確認してください。プランごとの対応状況は変更されるため、ここには記載しません。

## モデルについて

**各ツールの既定モデルで十分です。** 品質が足りないと感じた場合は、モデルを変えるより先に thinking / reasoning effort（思考にかける量）を上げてください。モデルの切り替えよりも結果に効きやすいレバーです。

具体的なモデル名やモデル ID はここには記載しません。世代交代が速く、書いた時点で古くなるためです。現在利用できるモデルは、各ツールのモデル選択機能で確認してください。

**参考ドキュメント**: [Choosing a model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)

### 6. モックアプリケーションの動作確認

```text
# 1. リポジトリを取得（Day0 で取得済みなら不要。Windows では OneDrive の同期対象を避け、C:\mlew\ のような短いパスで実行）
git clone https://github.com/aws-samples/aws-ml-enablement-workshop.git

# 2. モックを作成するディレクトリへ移動
cd aws-ml-enablement-workshop/yourwork

# 3. Kiro CLI のカスタムエージェントを起動
kiro-cli --agent mock-builder

# 4. 「アプリを作りたい」など適当な指示を入力
# 5. アプリケーションの詳細を入力
# 6. Tracker 情報は「なし」と回答
# 7. 20〜30 分待機（このうちワークスペース作成 約 1.5 分、build 約 50 秒、初回デプロイ 約 4 分）
```

> [!IMPORTANT]
> **CDK bootstrap はアカウント×リージョンごとに初回 1 回必要です。** bootstrap はエージェントが実行し、モックのデプロイ先リージョンと WAF 用の us-east-1 の両方が対象になります。デプロイ先リージョンはエージェントが決めて `product/construction/plan.md` に記録し、CDK の設定（`packages/infra/src/main.ts`）に固定します。決め方は [`yourwork/template/DEPLOYMENT_GUIDE.md` の「リージョンの決め方」](/yourwork/template/DEPLOYMENT_GUIDE.md#リージョンの決め方) を参照してください。リージョンを聞かれたら答えてください。**事前確認と当日で同じリージョンを使ってください。** そうすれば当日に bootstrap をやり直す必要はありません。

方法 C / 方法 D を利用する場合は、上記の 3. を次のコマンドに置き換えてください（4. 以降は同じです）。

**方法 C : Claude Code**

```text
# 3. Claude Code を起動
claude
```

`yourwork/CLAUDE.md` と `yourwork/AGENTS.md` が読み込まれた状態で起動します。`yourwork/.claude/skills/mock-builder/` にモック構築用の skill があるため、「アプリを作りたい」と依頼すればモック構築の手順に入ります（`/mock-builder` と明示的に呼び出すこともできます）。

**方法 D : OpenAI Codex CLI**

```text
# 3. Codex CLI を起動
codex
```

`yourwork/AGENTS.md` が読み込まれた状態で起動します。「アプリを作りたい」と依頼し、作業の起点として `yourwork/prompt/prompt.md` を渡してください。

### 7. 作成されたモックアプリケーションの削除

- 起動中の AI コーディングツールに「`product/` ディレクトリを参照し、デプロイしたアプリケーションを削除して」と依頼します。エージェントは [`yourwork/template/DEPLOYMENT_GUIDE.md` の「削除」](/yourwork/template/DEPLOYMENT_GUIDE.md#削除) に従って削除します。
- 削除が終わったら、デプロイ先リージョン（`product/construction/plan.md` に記録されています）と us-east-1 の両方でスタックが残っていないことを確認します。どちらも表が空なら完了です。

```text
aws cloudformation describe-stacks --region <デプロイ先リージョン> --query "Stacks[?starts_with(StackName,'product-infra-sandbox-')].[StackName,StackStatus]" --output table
aws cloudformation describe-stacks --region us-east-1 --query "Stacks[?starts_with(StackName,'product-infra-sandbox-')].[StackName,StackStatus]" --output table
```

- WAF と KMS キーに 1 デプロイあたり月額 約 $8 の固定費がかかるため、動作確認が終わったら削除してください
