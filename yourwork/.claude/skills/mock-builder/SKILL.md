---
name: mock-builder
description: PR/FAQ からワークショップ用のモック Web アプリを作り、MLEW Tracker を組み込んで AWS にデプロイする。ユーザーが「モックを作りたい」「PR/FAQ を実装したい」「Tracker で計測できるアプリを作りたい」と依頼したとき、または yourwork/product/ に成果物を作る作業のときに使う。
---

# モックアプリの作成

`aws-ml-enablement-workshop/yourwork` をカレントディレクトリとして実行します。以下のパスはすべてここからの相対パスです。

## 1. 入力を集める

ユーザーに次の 2 つを尋ねます。1 は必須、2 は任意です。

1. **実装したいアプリケーションの詳細**（Refine で作成した PR/FAQ）。長文をそのまま貼ってもらって構いません。
2. **（任意）MLEW Tracker のエンドポイント情報**: API Endpoint / API Key / Dashboard URL / Tracker SDK URL。

2 が空のまま進める場合は、計測が動かない状態で完成することと、あとでエンドポイントを差し替える必要があることをユーザーに伝えてから着手します。

## 2. prompt.md を読んで実行する

`prompt/prompt.md` を読み、プレースホルダーに上の回答を当てて実行します。

- `<application_requirements>` ← 1 の回答
- `<tracker_configuration>` ← 2 の回答

成果物・実装方針・進め方・完了条件は `prompt/prompt.md` にあるものを使います。このファイルには複製していないので、着手前に読んでください。ディレクトリ全体の決めごと（編集してはいけない場所、ビルドコマンド）は `AGENTS.md` にあります。

## 3. 完了条件を満たす

`prompt/prompt.md` の「完了条件」の各項目について、コマンドの出力か該当行を示します。自己申告の「確認しました」では完了にしません。
