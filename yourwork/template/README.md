# template

モックを作るときに参照する配布物です。参加者全員が共有するので、モックの作業中は編集しません。

| パス | 内容 |
| --- | --- |
| `DEPLOYMENT_GUIDE.md` | 前提条件、リージョンの決め方、生成からデプロイまでの手順、削除、既知の問題への対処 |
| `TRACKER_INTEGRATION_GUIDE.md` | Tracker の固定ファイルの置き方、接続コード、命名規約、計測対象 |
| `website/public/tracker-sdk.js` | 固定ファイル。ビルド済みの Tracker SDK（UMD、nanoid を含む単体ビルド）。`window.MLEWTracker` を定義する |
| `website/src/services/mlewTracker.ts` | 固定ファイル。SDK の初期化と計測の関数。import を持たず、`window.MLEWTracker` とブラウザ標準 API だけに依存する |

固定ファイルは、Tracker を使うモックに内容を変えずにコピーします（`TRACKER_INTEGRATION_GUIDE.md`）。

`tracker-sdk.js` の出どころ: `yourwork/tracker/` で `npm ci` と `npm run build:sdk` を実行した `packages/tracker-sdk/dist/tracker-sdk.js` から末尾の `//# sourceMappingURL=` 行を除き、生成されたワークスペースの `biome.json`（Biome 2.5.15）で `biome format --write` したものです。
