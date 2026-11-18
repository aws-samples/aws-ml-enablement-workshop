# モックの利用状況の分析ガイド

モックに組み込んだ MLEW Tracker の記録から、利用状況（ページビュー、クリック、人数、LP からアプリへの流れ、時間ごとの推移）を集計して答える方法です。記録は CloudWatch RUM が CloudWatch Logs に保存しているので、CloudWatch Logs Insights のクエリで集計します。

- 答えは**日本語で**返します。ユーザーは非エンジニアの場合が多いので、クエリや JSON ではなく、数字と短い解釈を返します。
- 使うのは読み取りのコマンド（`aws rum get-app-monitor`、`aws logs describe-log-groups`、`aws logs start-query`、`aws logs get-query-results`）だけです。AWS のリソースは作成・変更しません。
- コマンドの書き方（シェルによる違い）は [`AGENTS.md` の「シェルの扱い」](/yourwork/AGENTS.md#シェルの扱い) に従います。`aws` コマンドには、モックのデプロイに使ったプロファイルとリージョン（`product/construction/plan.md` に記録）を `--profile` / `--region` で付けます。

## 1. ロググループを特定する

モックのスタックがあるときは、app monitor からロググループ名を取ります。app monitor の名前は `product-infra-sandbox-Application-tracker` です。

```
aws rum get-app-monitor --profile <プロファイル名> --region <デプロイ先リージョン> --name product-infra-sandbox-Application-tracker --query "AppMonitor.DataStorage.CwLog.CwLogGroup" --output text
```

モックを削除したあとは app monitor が無いので、ロググループを直接探します。ロググループは削除後も 30 日間の記録を保ったまま残ります。

```
aws logs describe-log-groups --profile <プロファイル名> --region <デプロイ先リージョン> --log-group-name-prefix /aws/vendedlogs/RUMService_product-infra-sandbox-Application-tracker --query "logGroups[].[logGroupName,creationTime]" --output table
```

モックを削除して作り直すと、ロググループが複数出ます（作り直すごとに app monitor の ID が変わるため）。どの回のモックについて聞かれているかを `creationTime`（UNIX ミリ秒）から判断し、迷ったらユーザーに確認します。複数をまとめて集計するときは、`start-query` に `--log-group-names` で並べて渡します。

## 2. クエリを実行する

```
aws logs start-query --profile <プロファイル名> --region <デプロイ先リージョン> --log-group-name <ロググループ名> --start-time <UNIX 秒> --end-time <UNIX 秒> --query-string "<クエリ>" --query queryId --output text
aws logs get-query-results --profile <プロファイル名> --region <デプロイ先リージョン> --query-id <queryId> --output json
```

- `status` が `Complete` になるまで、`get-query-results` を数秒おきに繰り返します。結果の `@ptr` は AWS のアカウント ID を含むので、ユーザーへの答えや貼り付ける出力には含めません。30 回で終わらなければ、期間を短くして実行し直します。
- 期間は、指定が無ければ過去 30 日（記録の保持期間）から現在までです。時刻はコマンドの出力から入れ、推測しません（現在: `node -e "console.log(Math.floor(Date.now()/1000))"`、ISO 8601 の時刻から: `node -e "console.log(Date.parse('2026-01-01T00:00:00Z')/1000)"`）。
- **イベントは発生から 2 分ほどで検索できるようになります。** 「今触ったのに出てこない」ときは、2〜3 分待ってから実行し直します。
- クエリ文字列の引用符は、シェルによって扱いが違います。うまく渡らないときは、クエリをファイルに書いてから渡します（PowerShell なら `--query-string (Get-Content <ファイル> -Raw)`、POSIX シェルなら `--query-string "$(cat <ファイル>)"`）。

## 3. 必ず除くもの

どのクエリも、先頭に次の filter を付けます（下のレシピには付けてあります）。

```
filter metadata.domain != "localhost" and application_version != "verification"
```

- `localhost` は開発中のローカルからのアクセス、`verification` はモックの完成時に送った検証用のイベントです。どちらも利用者の反応ではありません。
- 開発中のアクセスも含めてほしいと言われたときだけ、`metadata.domain` の条件を外します。
- 除いた件数が残った件数より多いときは、数字が小さい理由としてそのことを一言添えます。

## 4. クエリのレシピ

記録の種類（`event_type`）は次の 4 つです。

| event_type | 内容 | 主なフィールド |
| --- | --- | --- |
| `com.amazon.rum.page_view_event` | ページビュー（初回表示、Link での遷移、戻る・進む） | `metadata.pageId`（パス） |
| `mlew.click` | `data-track-name` を付けた要素のクリック | `event_details.elementName`、`event_details.page`（クリックした画面） |
| `mlew.action` | クリック以外の操作（ドラッグ＆ドロップ、選択の変更など。`trackAction` で記録） | `event_details.actionName`、`event_details.page`、操作ごとの追加の値 |
| `mlew.section_view` | `data-track-section` を付けたセクション（LP のセクション、結果・完了の表示など）の表示。ページごとに 1 回 | `event_details.sectionName`、`event_details.page` |

- ほかに、訪問の始まり（`com.amazon.rum.session_start_event`）と検証用のイベント（`mlew.verification`）が記録されています。利用者の操作ではないので、操作の件数には数えません。
- 人の数は `user_details.userId`（ブラウザごと）、訪問の数は `user_details.sessionId`（30 分操作が無いと切れる）で数えます。
- モックの版（`initTracker` の `version`。既定は `v1`）は `application_version` に入ります。版ごとに分けるときは、`stats` の `by` に `application_version` を足します。
- 時刻は秒単位で記録されるので、同じ秒の中の順序は分かりません。
- 名前（`elementName` / `actionName` / `sectionName`）の付け方は [MLEW Tracker 導入ガイド](/yourwork/template/TRACKER_INTEGRATION_GUIDE.md) の「命名規約」にあります（例: `lp-hero-signup-button` は LP のヒーロー領域の登録ボタン）。

ページごとのページビュー:
```
filter metadata.domain != "localhost" and application_version != "verification" | filter event_type = "com.amazon.rum.page_view_event" | stats count(*) as views, count_distinct(user_details.userId) as users by metadata.pageId | sort views desc
```

要素ごとのクリック:
```
filter metadata.domain != "localhost" and application_version != "verification" | filter event_type = "mlew.click" | stats count(*) as clicks, count_distinct(user_details.sessionId) as sessions by event_details.elementName, event_details.page | sort clicks desc
```

クリック以外の操作:
```
filter metadata.domain != "localhost" and application_version != "verification" | filter event_type = "mlew.action" | stats count(*) as actions, count_distinct(user_details.sessionId) as sessions by event_details.actionName, event_details.page | sort actions desc
```

人数と訪問数:
```
filter metadata.domain != "localhost" and application_version != "verification" | stats count_distinct(user_details.userId) as users, count_distinct(user_details.sessionId) as sessions
```

LP → CTA → アプリのファネル（訪問単位）。先に「要素ごとのクリック」を実行して LP の CTA の `elementName` を確かめ、`/signup/` をそれに合う正規表現に置き換えます（CTA が複数あるときは、すべてに合う正規表現にします。例: `/^lp-.*-start-button$/`）。結果・完了の画面まで進んだかは、「セクションごとの到達数」で結果のセクション（例: `app-result-summary`）を見ます。同じ訪問で各段階を通ったかを数え、順序は見ません。
```
filter metadata.domain != "localhost" and application_version != "verification" | filter event_type in ["com.amazon.rum.page_view_event", "mlew.click"] | fields (event_type = "com.amazon.rum.page_view_event" and metadata.pageId = "/") as lp, (event_type = "mlew.click" and event_details.elementName like /signup/) as cta, (event_type = "com.amazon.rum.page_view_event" and metadata.pageId like /^\/app/) as app | stats max(lp) as sawLp, max(cta) as sawCta, max(app) as sawApp by user_details.sessionId | stats count(*) as sessions, sum(sawLp) as step1Lp, sum(sawLp * sawCta) as step2Cta, sum(sawLp * sawCta * sawApp) as step3App
```

時間ごとの推移（`bin` は UTC です。答えるときは日本時間に直します）:
```
filter metadata.domain != "localhost" and application_version != "verification" and event_type != "com.amazon.rum.session_start_event" | stats count(*) as events by bin(1h) as t, event_type | sort t asc
```

セクションごとの到達数（LP のどこまで読まれたか、結果・完了の画面まで進んだか）:
```
filter metadata.domain != "localhost" and application_version != "verification" | filter event_type = "mlew.section_view" | stats count_distinct(user_details.sessionId) as sessions by event_details.sectionName | sort sessions desc
```

レシピに無い質問は、上のフィールドを組み合わせてクエリを作ります。作ったクエリは、答えと一緒に示します。

## 5. 答え方

- 最初に結論を 1〜2 文で答え、そのあとに表を示します。割合には分母も書きます（例: 「LP を見た 12 訪問のうち 5（42%）がアプリに進みました」）。
- `elementName`、`actionName`、`sectionName` はそのまま見せず、「LP の登録ボタン」のような日本語の呼び名にし、元の名前は表の補足に回します。
- 件数が少ない（目安として 30 訪問未満）ときは、傾向として断定しないよう添えます。
- 0 件のときは、期間、除外の条件、検索できるまでの遅れ（2 分ほど）を確かめてから答えます。
- グラフを頼まれたときだけ、`product/construction/analytics/` に自己完結の HTML（インライン SVG。外部の script や CDN は使わない）で保存し、パスを伝えます。
