---
name: mock-builder
description: PR/FAQ からワークショップ用のモック Web アプリを作り、MLEW Tracker（CloudWatch RUM）を組み込んで AWS にデプロイする。ユーザーが「モックを作りたい」「PR/FAQ を実装したい」「計測できるアプリを作りたい」と依頼したとき、または yourwork/product/ に成果物を作る作業のときに使う。
---

# モックアプリの作成

`aws-ml-enablement-workshop/yourwork` をカレントディレクトリとして実行します。以下のパスはすべてここからの相対パスです。

## 1. 入力を集める

**実装したいアプリケーションの詳細**（Refine で作成した PR/FAQ）を集めます。依頼文に内容（またはその置き場所）が書かれていれば、それを使い、聞き直しません。指定が無ければ、まず `discovery/README.md` の Refine セクションを読みます。そこが空のときだけユーザーに尋ねます（長文をそのまま貼ってもらって構いません）。

Tracker（計測）に受け取る値はありません。受け口はモックと一緒にデプロイされます。

## 2. prompt.md を読んで実行する

`prompt/prompt.md` を読み、`<application_requirements>` に上で集めた内容を当てて実行します。

目的・判断基準・完了条件は `prompt/prompt.md`、手順は `template/DEPLOYMENT_GUIDE.md`、計測は `template/TRACKER_INTEGRATION_GUIDE.md`、完了条件の検証イベントの確認は `template/ANALYTICS_GUIDE.md`、ディレクトリの決まりごとは `AGENTS.md` にあります。このファイルには複製していないので、着手前に読んでください。

## 3. 完了条件を満たして止まる

`prompt/prompt.md` の「完了条件」の各項目について、実行したコマンドとその出力を示します。ブラウザでの確認はユーザーに依頼します。満たしたら作り込みを続けず、止まって報告します。
