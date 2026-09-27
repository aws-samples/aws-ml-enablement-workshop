# AGENTS.md — ML Enablement Workshop / yourwork

このディレクトリは、ワークショップで立てた仮説（Refine で作成した PR/FAQ）を、実際の利用者に触ってもらえる Web アプリのモックにするための作業場所です。モックには MLEW Tracker を組み込み、利用者の反応を実データで計測します。

## 前提

- カレントディレクトリは `aws-ml-enablement-workshop/yourwork`。以下のパスはすべてここからの相対パスです。
- Node.js v18.0.0 以上、npm v8.0.0 以上。
- AWS にデプロイする場合は、認証情報が設定済みであること。

## まず読むファイル

| ファイル | 役割 |
|---|---|
| `prompt/prompt.md` | 作るものの仕様と進め方。作業の起点 |
| `template/DEPLOYMENT_GUIDE.md` | 技術選定とデプロイ手順 |
| `template/TRANCKER_INTEGRATION_GUIDE.md` | Tracker 統合の実装方法。ファイル名の `N` は既存の綴り誤りですが実体のファイル名なので、このまま参照してください |
| `template/app/` | 構成の参考にする雛形 |

## 成果物の置き場

ランディングページ・メインアプリケーション・CloudFormation テンプレートは `product/` に置きます。`product/` は**ファイルではなくディレクトリとして作成**してください。

## ビルドと確認

`product/` 配下のアプリケーションディレクトリで実行します。

```bash
npm install
npm run dev     # ローカルで画面を確認する
npm run build   # 完了条件のひとつ
```

## このディレクトリでの決めごと

- **Tracker SDK は自作しません。** `tracker-sdk.js` を script タグで外部から読み込み、`window.MLEWTracker.Tracker` を使います。自作すると画面上は動いて見えてもイベントがどこにも送信されず、実データで反応を測るというワークショップの目的が達成できません。
- **Tracker 以外はモックで実装します。** バックエンド API・データベース・外部サービス連携はモック実装にし、MVP として画面が一通り動くことを内部設計の作り込みより先に成立させます。Tracker だけは本物の SDK と本物のエンドポイントを使います。
- **`template/` 配下と `tracker/` 配下は編集しません。** どちらも参加者全員が共有する配布物で、書き換えると他の参加者の手順と食い違います。変更は `product/` に閉じてください。
- 画面に出るテキストは、特別な指定がない限り日本語にします。

## 完了条件

「確認しました」という報告ではなく、それぞれコマンドの出力か該当行を示してください。

- `npm run build` が成功する — 末尾のビルド結果の出力を示す
- ルーティングが機能する — ランディングページから各画面へ遷移でき、直接 URL でも表示されることを、確認した経路とともに示す
- `tracker-sdk.js` の外部読み込みが実在する — `grep -rn "tracker-sdk.js" product/` の出力で、設定した SDK URL を指す script タグの該当行を示す
- デプロイした場合は、CloudFront の URL とそこへのアクセスが成功した結果を示す

## ツール別の入口

| ツール | 入口 |
|---|---|
| Kiro CLI | `kiro-cli --agent mock-builder`（定義は `.kiro/agents/mock-builder.json`） |
| Claude Code | `claude`。`.claude/skills/mock-builder/` の skill が作業の導線です |
| OpenAI Codex CLI | `codex`。このファイルを自動で読み込みます |
