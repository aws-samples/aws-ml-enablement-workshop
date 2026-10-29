# AGENTS.md — ML Enablement Workshop / yourwork

このディレクトリは、ワークショップで立てた仮説（Refine で作成した PR/FAQ）を、実際の利用者に触ってもらえる Web アプリのモックにするための作業場所です。モックには MLEW Tracker を組み込み、利用者の反応を実データで計測します。

カレントディレクトリは `aws-ml-enablement-workshop/yourwork` です。以下のパスはすべてここからの相対パスです。

## まず読むファイル

| ファイル | 役割 |
|---|---|
| `prompt/prompt.md` | 作るものの目的・判断基準・完了条件。作業の起点 |
| `template/DEPLOYMENT_GUIDE.md` | 前提条件、リージョンの決め方、生成からデプロイまでの手順、削除、既知の問題への対処 |
| `template/TRACKER_INTEGRATION_GUIDE.md` | Tracker の固定ファイル、接続コード、命名規約、計測対象 |

完了条件は `prompt/prompt.md` の「完了条件」、前提ツールは `template/DEPLOYMENT_GUIDE.md` の `## 前提条件` にあります。このファイルには重複して書きません。

## 検証済みバージョン

手順はこの組み合わせで確認しています（要件ではなく、検証に使った版です。要件は `template/DEPLOYMENT_GUIDE.md` の `## 前提条件`）。生成コマンドのバージョンはこの表と揃えます。plugin を上げるときは、この表と `template/DEPLOYMENT_GUIDE.md` の `## 既知の問題への対処（@aws/nx-plugin 1.0.6 で確認）` を見直します。

| 項目 | バージョン |
|---|---|
| `@aws/create-nx-workspace` / `@aws/nx-plugin` | 1.0.6（`pnpm create @aws/nx-workspace@1.0.6 product --iac=cdk --no-interactive`） |
| Node.js | 24.13.0 |
| pnpm | 12.4.1 |
| 検証日 | 2026-10-29（macOS。`--stageConfig` で生成し、名前付きプロファイルで build〜bootstrap〜deploy〜destroy を確認。2026-10-23 に完了条件の確認まで、2026-10-10 に Claude Code と Kiro CLI でも確認。Windows は未検証） |

## シェルの扱い

Windows では、ネイティブの PowerShell で動かします（WSL2 や Git Bash は前提にしません）。macOS / Linux では標準のシェルを使います。文書のコマンドは、シェルで書き方が変わる部分を意図で書いているので、構文は実行するシェルに合わせて選んでください。

- **コマンドは 1 行で書きます。** 行末の `\` や `` ` `` による継続行は使いません。
- **デプロイ先リージョンとプロファイルは環境変数で渡しません。** plugin が生成する `packages/common/infra-config/src/stages.config.ts` に書きます（`template/DEPLOYMENT_GUIDE.md` の手順 5）。シェルの `AWS_REGION` はエージェント自身の設定に由来することがあり、それに頼ると意図しないリージョンへデプロイされます。
- **`aws` CLI は `--profile` と `--region` を付け、`--query` の式はダブルクォートで囲みます。** シングルクォートは PowerShell と cmd で解釈が異なるためです。
- **`curl` は、PowerShell の場合だけ `curl.exe` と書きます**（macOS / Linux では `curl` のまま）。PowerShell の `curl` は `Invoke-WebRequest` の別名です。
- **JSON の本文はファイルに書いてから渡します**（`curl` の `--data-binary "@<ファイル>"` など）。コマンドラインに JSON を直接書くと、引用符の扱いがシェルごとに異なります。
- **検索や環境変数の設定など、シェル固有のコマンドは同等のものに置き換えます**（例: `grep` は PowerShell の `Select-String`）。
- **`pnpm nx <target> <project> -- <引数>` の `--` の後ろが渡らないときは、`"--"` と引用符で囲みます。** PowerShell から `.ps1` のシムを経由すると `--` が消えることがあるためです。

## 成果物の置き場

- ランディングページ・メインアプリケーション・Nx の infra プロジェクト（AWS CDK）は `product/` に置きます。`product/` は**ファイルではなくディレクトリとして作成**し、作るのは生成コマンドに任せます（先に作ると生成が失敗することがあります）。
- 計画・進捗・デプロイ先リージョン・プロファイル名は `product/construction/plan.md` に記録します。作る時期と再実行の判定は `template/DEPLOYMENT_GUIDE.md` の `## 手順` に従います。

## このディレクトリでの決まりごと

- モックの作り方の判断基準（MVP 優先、Tracker 以外はモックで実装、インフラの生成コードは書き換えない、Tracker は自作しない）は `prompt/prompt.md` にあります。
- **`template/` 配下と `tracker/` 配下は編集しません。** どちらも参加者全員が共有する配布物で、書き換えると他の参加者の手順と食い違います。変更は `product/` に閉じてください。
- **削除はユーザーの明示的な指示があったときだけ行います。** 手順は `template/DEPLOYMENT_GUIDE.md` の `## 削除` です。
- 画面に出るテキストは、特別な指定がない限り日本語にします。

## ツール別の入口

| ツール | 入口 |
|---|---|
| Kiro CLI | `kiro-cli --agent mock-builder`（定義は `.kiro/agents/mock-builder.json`） |
| Claude Code | `claude`。`.claude/skills/mock-builder/` の skill が作業の導線です |
| OpenAI Codex CLI | `codex`。このファイルを自動で読み込みます |
