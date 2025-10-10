# Lambda 関数実装ガイド

このディレクトリには MLEW Tracker のバックエンド処理を支える 3 つの Lambda 関数が格納されています。それぞれが役割分担を行い、API から受け取ったイベントを DynamoDB に取り込み、集計し、ダッシュボードからの参照要求に応答します。本ドキュメントでは各関数の実装構成、依存リソース、主な処理フロー、注意点を詳しく説明します。

## 共通仕様

- **ランタイム**: Node.js 20.x（CDK の `NodejsFunction` が esbuild で TypeScript からバンドル）
- **依存ライブラリ**: AWS SDK v3 (`@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb` など) のみを利用。ランタイムへは CDK のバンドラが必要最小限を含めます。
- **デプロイ方式**: CDK スタックが各ソースをエントリポイントとして参照し、CodeBuild パイプライン経由で `npm run build` を実行したうえで `cdk deploy` によって Lambda に反映されます。
- **環境変数**: テーブル名などは CDK から注入されます。ローカル実行時に環境変数が欠けると例外になるため注意してください。

---

## 1. `event-ingestion`

### 概要

- **役割**: フロントエンドや SDK から送信されるイベントバッチ（POST `/v1/events`）を DynamoDB に保存し、アプリケーション単位のサマリ統計値を更新します。
- **トリガー**: Amazon API Gateway (REST)。`POST` と `OPTIONS` に対応。CORS レスポンスヘッダーはコード内の `getCorsHeaders()` で付与します。

### エントリポイントと処理フロー

1. `handler(event: APIGatewayProxyEvent)` が呼び出され、まず CORS のプリフライト（HTTP `OPTIONS`）に 200 を返します。
2. `event.body` を JSON パースし、`applicationId` と `events` 配列を検証。
3. 各イベントに対して以下の正規化を実施:
   - `eventId` が未指定の場合は `randomUUID()` で発番。
   - DynamoDB のソートキーに用いる `timestampEventId` を `{timestamp}#{eventId}` 形式で生成。
   - TTL 属性 (`ttl`) を現在時刻 + `EVENT_TTL_DAYS` (秒換算) で付与。
   - イベント日付 (`date`) を `yyyy-mm-dd` 文字列で保持。
4. 最大 25 件のバッチに分割し、`BatchWriteCommand` で DynamoDB の **Events テーブル** (`EVENTS_TABLE`) へ一括 Put。
5. 同時に **Applications テーブル** (`APPLICATIONS_TABLE`) の統計を `UpdateCommand` で更新。`totalEvents` の加算、`lastActivity` の更新などを実施。
6. 成功時は `processedCount` を含む 200 レスポンスを返却。失敗時は 500 でエラーメッセージを返します。

### 主な環境変数

| 変数名 | 説明 |
| --- | --- |
| `EVENTS_TABLE` | イベントデータを格納する DynamoDB テーブル名 |
| `APPLICATIONS_TABLE` | アプリケーション統計を保持する DynamoDB テーブル名 |
| `EVENT_TTL_DAYS` | TTL 設定に使用する保持日数 |

### 補足

- 旧実装で行っていた CloudWatch メトリクス送信や S3 アーカイブ処理は PR コメントに従い削除済みです。
- CORS ヘッダーはフロントエンド SDK が直接叩けるようワイルドカード (`*`) を許容しています。制限が必要な場合は API Gateway 側の CORS 設定と合わせて調整してください。

---

## 2. `stream-aggregation`

### 概要

- **役割**: Events テーブルに書き込まれたレコードを DynamoDB Streams から受け取り、時間粒度別の集計を書き出します。
- **トリガー**: DynamoDB Streams（`INSERT` / `MODIFY`）。イベント取り込みが発生するたびに非同期で実行されます。

### エントリポイントと処理フロー

1. `handler(event: DynamoDBStreamEvent)` が呼び出され、各 `record` の `NewImage` を `unmarshall` で復元して `AggregationUpdate` に変換。
2. `applicationId` と「時間キー」（1時間単位）でグルーピング。キーは `${applicationId}#${hourTimestamp}` 形式です。
3. グループ化したイベントごとに `updateAggregations` を実行し、**Aggregations テーブル** (`AGGREGATIONS_TABLE`) を更新。
   - `applicationIdPeriod`（`<appId>#hourly` または `<appId>#daily`）をパーティションキーに使用。
   - `totalEvents`、`uniqueUsers`、`sessions` をインクリメント。
   - イベント種別 (`click`/`view`/`custom`) のカウントとページビューを集計。
   - 一度の実行で「時間（hourly）」「日（daily）」の 2 つの粒度を更新します。
4. 処理結果をログ出力。失敗した場合はエラーを投げて Lambda 再試行に委ねます。

### 主な環境変数

| 変数名 | 説明 |
| --- | --- |
| `AGGREGATIONS_TABLE` | 集計結果を蓄積する DynamoDB テーブル名 |

### 補足

- `uniqueUsers` は `Set` を使って Lambda 内で重複排除しています。DynamoDB には `Set` 型として加算する実装 (`if_not_exists` + `ADD`) を採用しています。
- 集計粒度を増やしたい場合はキー生成ロジックと `UpdateExpression` を拡張してください。

---

## 3. `query`

### 概要

- **役割**: ダッシュボードからの参照 API（GET `/v1/analytics/...`）に応答し、アプリケーション一覧・イベント詳細・サマリ統計を返します。
- **トリガー**: Amazon API Gateway (REST)。`GET` と `OPTIONS` に対応します。

### ルーティング

`handler` 関数内で `event.path` と `event.httpMethod` を判定し、以下の内部関数にディスパッチします。

| エンドポイント | 対応関数 | 内容 |
| --- | --- | --- |
| `GET /v1/analytics/applications` | `getApplications()` | Applications テーブルをスキャンし、名称・イベント数・最終アクティビティなどを返却 |
| `GET /v1/analytics/{appId}/summary` | `getApplicationSummary()` | Aggregations テーブル (daily) と Events テーブルを読み出し、ダッシュボードが利用する統計 (`topEvents`, `timeSeriesData` など) を生成 |
| `GET /v1/analytics/{appId}/events` | `getEvents()` | 指定アプリケーションの生イベントをクエリ。期間・イベント種別・件数などで絞り込み |

### 主要ロジック

- **クエリパラメータの正規化**: `normalizeQueryParams` で `null`/`undefined` を除去し、数値変換が必要なものはメソッド側でパース。
- **アプリケーション一覧**: `ScanCommand` でアプリケーション情報を取得。レスポンスは `{ applications, count }`。
- **サマリ**:
  - Aggregations テーブルから `applicationIdPeriod = <appId>#daily` の範囲クエリを実行。
  - 最新のイベント（最大 1,000 件）を Events テーブルから取得し、時間帯別のグラフやトップイベントなどを算出。
  - 現状 `periodComparison` はモック値（`Math.random()`）で生成しています。要件に応じて差し替えてください。
- **イベント一覧**: キー条件に `timestampEventId BETWEEN` を追加することで期間フィルタを実現。`eventType` が指定された場合は取得後にフィルタリングします。
- **CORS 応答**: `getCorsHeaders()` 経由でレスポンス全体にヘッダーを付与。

### 主な環境変数

| 変数名 | 説明 |
| --- | --- |
| `EVENTS_TABLE` | 生イベントを保持する DynamoDB テーブル名 |
| `AGGREGATIONS_TABLE` | 集計結果を保持する DynamoDB テーブル名 |
| `APPLICATIONS_TABLE` | アプリケーション概要を保持する DynamoDB テーブル名 |

### 補足

- ルーティングは `event.path` の完全一致や正規表現で行っているため、API Gateway 側でパスが変更された場合はここも合わせて更新してください。
- パフォーマンス向上のためには Aggregations テーブルのスキーマ（現在は `applicationIdPeriod`, `timestamp`）とアクセスパターンを併せて再検討する余地があります。

---

## 参考: 関数間のデータフロー

1. **イベント受信**: `event-ingestion` が API Gateway からのリクエストを受け取り、Events テーブルと Applications テーブルを更新。
2. **集計更新**: DynamoDB Streams を介して `stream-aggregation` が呼び出され、Aggregations テーブルに時間粒度の統計を蓄積。
3. **ダッシュボード表示**: `query` がフロントエンドからの GET リクエストに応答し、最新の生データと集計をダッシュボードへ返却。

この 3 つの関数が連携することで、MLEW Tracker のイベント取り込みからダッシュボード表示までのデータパイプラインを構成しています。

