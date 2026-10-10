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

手順はこの組み合わせで確認しています。生成コマンドのバージョンはこの表と揃えます。plugin を上げるときは、この表と `template/DEPLOYMENT_GUIDE.md` の `## 既知の問題への対処（@aws/nx-plugin 1.0.6 で確認）` を見直します。

| 項目 | バージョン |
|---|---|
| `@aws/create-nx-workspace` / `@aws/nx-plugin` | 1.0.6（`pnpm create @aws/nx-workspace@1.0.6 product --iac=cdk --no-interactive`） |
| Node.js | 22.13 以上（推奨: 24 LTS）。検証環境は 24.13.0 |
| pnpm | 12.4.1 |
| uv | 0.5.29 以上 |
| 検証日 | 2026-10-10（macOS。Claude Code と Kiro CLI で生成〜build〜deploy〜destroy を確認。Windows は未検証） |

## シェルの扱い

Windows では、ネイティブの PowerShell で動かします（WSL2 や Git Bash は前提にしません）。macOS / Linux では標準のシェルを使います。文書のコマンドは、シェルで書き方が変わる部分を意図で書いているので、構文は実行するシェルに合わせて選んでください。

- **コマンドは 1 行で書きます。** 行末の `\` や `` ` `` による継続行は使いません。
- **デプロイ先リージョンは環境変数で渡しません。** 生成された `packages/infra/src/main.ts` の `env.region` に書きます（`template/DEPLOYMENT_GUIDE.md` の `## リージョンの決め方`）。シェルの `AWS_REGION` はエージェント自身の設定に由来することがあり、それに頼ると意図しないリージョンへデプロイされます。
- **`aws` CLI は `--region` を付け、`--query` の式はダブルクォートで囲みます。** シングルクォートは PowerShell と cmd で解釈が異なるためです。
- **`curl` は、PowerShell の場合だけ `curl.exe` と書きます**（macOS / Linux では `curl` のまま）。PowerShell の `curl` は `Invoke-WebRequest` の別名です。
- **JSON の本文はファイルに書いてから渡します**（`curl` の `--data-binary "@<ファイル>"` など）。コマンドラインに JSON を直接書くと、引用符の扱いがシェルごとに異なります。
- **検索や環境変数の設定など、シェル固有のコマンドは同等のものに置き換えます**（例: `grep` は PowerShell の `Select-String`）。
- **`pnpm nx <target> <project> -- <引数>` の `--` の後ろが渡らないときは、`"--"` と引用符で囲みます。** PowerShell から `.ps1` のシムを経由すると `--` が消えることがあるためです。

## 成果物の置き場

- ランディングページ・メインアプリケーション・Nx の infra プロジェクト（AWS CDK）は `product/` に置きます。`product/` は**ファイルではなくディレクトリとして作成**し、作るのは生成コマンドに任せます（先に作ると生成が失敗することがあります）。
- `product/nx.json` があれば生成済みです。再実行の判定にはこれを使います。
- 計画・進捗・デプロイ先リージョンは、生成が終わってから `product/construction/plan.md` に記録します。

## このディレクトリでの決まりごと

- **Tracker は自作しません。** `template/` にある公式の固定ファイル（SDK と連携コード）をそのままモックにコピーし、生成されたファイルには接続コードだけを書きます（`template/TRACKER_INTEGRATION_GUIDE.md`）。自作すると画面上は動いて見えてもイベントがどこにも送信されず、実データで反応を測るというワークショップの目的が達成できません。
- **インフラの生成コードは書き換えません。** 設定は公開 props で渡します。CSP・WAF・KMS は生成物の既定値を使います。
- **Tracker 以外はモックで実装します。** バックエンド API・データベース・外部サービス連携はモック実装にし、MVP として画面が一通り動くことを内部設計の作り込みより先に成立させます。Tracker だけは本物の SDK と本物のエンドポイントを使います。
- **`template/` 配下と `tracker/` 配下は編集しません。** どちらも参加者全員が共有する配布物で、書き換えると他の参加者の手順と食い違います。変更は `product/` に閉じてください。
- **削除はユーザーの明示的な指示があったときだけ行います。** 手順は `template/DEPLOYMENT_GUIDE.md` の `## 削除` です。
- 画面に出るテキストは、特別な指定がない限り日本語にします。

## ツール別の入口

| ツール | 入口 |
|---|---|
| Kiro CLI | `kiro-cli --agent mock-builder`（定義は `.kiro/agents/mock-builder.json`） |
| Claude Code | `claude`。`.claude/skills/mock-builder/` の skill が作業の導線です |
| OpenAI Codex CLI | `codex`。このファイルを自動で読み込みます |
