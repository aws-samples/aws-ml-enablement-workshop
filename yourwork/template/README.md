# template

モックを作るときに参照する配布物です。参加者全員が共有するので、モックの作業中は編集しません。

| パス | 内容 |
| --- | --- |
| `DEPLOYMENT_GUIDE.md` | 前提条件、リージョンの決め方、生成からデプロイまでの手順、削除、既知の問題への対処 |
| `TRACKER_INTEGRATION_GUIDE.md` | Tracker の固定ファイルの置き方、接続コード、命名規約、計測対象 |
| `ANALYTICS_GUIDE.md` | Tracker の記録（CloudWatch Logs）から利用状況を集計する Logs Insights のクエリと答え方 |
| `infra/src/constructs/mlew-tracker.ts` | 固定ファイル。CloudWatch RUM の app monitor を作り、その ID とリージョンを `runtime-config.json` に書く CDK コンストラクト |
| `website/src/services/mlewTracker.ts` | 固定ファイル。`runtime-config.json` を読み、`@aws-rum/web-slim` でページビュー・クリック・セクションの表示を送る |

固定ファイルは、モックに内容を変えずにコピーします（`DEPLOYMENT_GUIDE.md` の手順 6 と `TRACKER_INTEGRATION_GUIDE.md`）。どちらも、生成されたワークスペースの `biome.json`（Biome 2.5.15）で整形してあります。
