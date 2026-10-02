# AGENTS.md — ML Enablement Workshop / yourwork

このディレクトリは、ワークショップで立てた仮説（Refine で作成した PR/FAQ）を、実際の利用者に触ってもらえる Web アプリのモックにするための作業場所です。モックには MLEW Tracker を組み込み、利用者の反応を実データで計測します。

## 前提

- カレントディレクトリは `aws-ml-enablement-workshop/yourwork`。以下のパスはすべてここからの相対パスです。
- Node.js 22.12 以上（または 20.19 以上）。生成物の vite と nx がこれを要求するため、Node 18 では動きません。
- pnpm。依存が `catalog:` 指定のため、npm では install できません。
- uv。infra の build に含まれる checkov を `uvx` で実行します。
- AWS にデプロイする場合は、AWS CLI v2 と認証情報が設定済みで、アカウントが CDK bootstrap 済みであること（初回は `product/` で `pnpm nx bootstrap infra`）。

## まず読むファイル

| ファイル | 役割 |
|---|---|
| `prompt/prompt.md` | 作るものの仕様と進め方。作業の起点 |
| `template/DEPLOYMENT_GUIDE.md` | Nx Plugin for AWS でのビルドとデプロイ手順 |
| `template/TRANCKER_INTEGRATION_GUIDE.md` | Tracker 統合の実装方法。ファイル名の `N` は既存の綴り誤りですが実体のファイル名なので、このまま参照してください |

## 成果物の置き場

ランディングページ・メインアプリケーション・Nx の infra プロジェクト（AWS CDK）は `product/` に置きます。`product/` は**ファイルではなくディレクトリとして作成**してください。

## ビルドと確認

すべて `product/` 直下で実行します。

| 目的 | コマンド |
|---|---|
| 依存インストール | `pnpm install` |
| ローカル確認 | `pnpm dev`（website は http://localhost:4200） |
| 本番ビルドの確認 | `pnpm nx run @product/website:preview`（http://localhost:4300） |
| ビルド（完了条件） | `pnpm nx run-many -t build` |
| 整形の自動修正 | `pnpm lint`（Biome の整形漏れで build が失敗したとき） |
| 初回のみ | `pnpm nx bootstrap infra` |
| デプロイ | `pnpm nx deploy-sandbox infra` |
| 削除 | `pnpm nx destroy-sandbox infra -- --force`（明示的な指示があったときだけ。TTY の無いシェルでは `--force` が無いと `TtyNotAttached` で失敗する） |

## このディレクトリでの決めごと

- **Tracker SDK は自作しません。** `tracker-sdk.js` を script タグで外部から読み込み、`window.MLEWTracker.Tracker` を使います。自作すると画面上は動いて見えてもイベントがどこにも送信されず、実データで反応を測るというワークショップの目的が達成できません。
- **CSP に合わせて Tracker を組み込みます。** CloudFront の CSP は `script-src 'self'` なので、SDK のオリジンを `static-website.ts` の `scriptSrc` 経由で `script-src` に追加します。初期化は index.html のインライン script ではなく `packages/website/src/` の TypeScript から行います。インライン script は CSP で実行されません。
- **Tracker 以外はモックで実装します。** バックエンド API・データベース・外部サービス連携はモック実装にし、MVP として画面が一通り動くことを内部設計の作り込みより先に成立させます。Tracker だけは本物の SDK と本物のエンドポイントを使います。
- **`template/` 配下と `tracker/` 配下は編集しません。** どちらも参加者全員が共有する配布物で、書き換えると他の参加者の手順と食い違います。変更は `product/` に閉じてください。
- **削除はユーザーの明示的な指示があったときだけ行います。** `product/` で `pnpm nx destroy-sandbox infra -- --force` を実行し、デプロイ先リージョンと us-east-1（WAF）の両方で `product-infra-sandbox-` のスタックが残っていないことを確認します。
- 画面に出るテキストは、特別な指定がない限り日本語にします。

## 完了条件

「確認しました」という報告ではなく、それぞれコマンドの出力か該当行を示してください。

- `product/` で `pnpm nx run-many -t build` が成功する（infra の checkov を含む）— 末尾の出力を示す
- ルーティングが機能する — ランディングページから各画面へ遷移でき、直接 URL でも表示されることを、確認した経路とともに示す
- （Tracker 情報がある場合）`tracker-sdk.js` の外部読み込みが実在する — `grep -rn --exclude-dir=node_modules --exclude-dir=dist "tracker-sdk.js" product/packages/website/` の出力で、`packages/website/index.html` の script タグの行を示す
- デプロイ後の CloudFront の URL にアクセスでき、ブラウザのコンソールに CSP 違反（`Refused to load the script` / `Refused to execute inline script`）が出ていない
- （Tracker 情報がある場合）Tracker への送信が成功している — `/v1/events` への POST が 200 を返す、またはダッシュボードにイベントが表示される

## ツール別の入口

| ツール | 入口 |
|---|---|
| Kiro CLI | `kiro-cli --agent mock-builder`（定義は `.kiro/agents/mock-builder.json`） |
| Claude Code | `claude`。`.claude/skills/mock-builder/` の skill が作業の導線です |
| OpenAI Codex CLI | `codex`。このファイルを自動で読み込みます |
