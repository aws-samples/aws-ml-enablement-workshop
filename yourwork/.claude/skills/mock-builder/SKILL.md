---
name: mock-builder
description: PR/FAQ からワークショップ用のモック Web アプリを作り、MLEW Tracker を組み込んで AWS にデプロイする。ユーザーが「モックを作りたい」「PR/FAQ を実装したい」「Tracker で計測できるアプリを作りたい」と依頼したとき、または yourwork/product/ に成果物を作る作業のときに使う。
---

# モックアプリの作成

`aws-ml-enablement-workshop/yourwork` をカレントディレクトリとして実行します。以下のパスはすべてここからの相対パスです。

## 1. 入力を集める

次の 2 つを集めます。1 は必須、2 は任意です。依頼文に値（またはその置き場所）が書かれていれば、それを使い、聞き直しません。

1. **実装したいアプリケーションの詳細**（Refine で作成した PR/FAQ）。依頼文に指定が無ければ、まず `discovery/README.md` の Refine セクションを読みます。そこが空のときだけユーザーに尋ねます（長文をそのまま貼ってもらって構いません）。
2. **（任意）MLEW Tracker の値**: API Endpoint / API Key / Dashboard URL。受け取った API Endpoint / API Key がプレースホルダーのままなら着手せずユーザーに確認します（判定は `prompt/prompt.md` の `<tracker_configuration>` の直後）。「Tracker を使わない」と明示されたときだけ Tracker なしで進めます。

## 2. prompt.md を読んで実行する

`prompt/prompt.md` を読み、プレースホルダーに上で集めた内容を当てて実行します。

- `<application_requirements>` ← 1 の内容
- `<tracker_configuration>` ← 2 の内容

目的・判断基準・完了条件は `prompt/prompt.md`、手順は `template/DEPLOYMENT_GUIDE.md`、計測は `template/TRACKER_INTEGRATION_GUIDE.md`、ディレクトリの決まりごとは `AGENTS.md` にあります。このファイルには複製していないので、着手前に読んでください。

## 3. 完了条件を満たして止まる

`prompt/prompt.md` の「完了条件」の各項目について、実行したコマンドとその出力を示します。ブラウザでの確認はユーザーに依頼します。満たしたら作り込みを続けず、止まって報告します。
