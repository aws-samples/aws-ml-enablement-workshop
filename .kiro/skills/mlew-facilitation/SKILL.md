---
name: mlew-facilitation
description: ML Enablement Workshop のファシリテーションを行います。「MLEWをはじめる」「ワークショップを始めたい」「次に進んで」などのリクエストで起動し、ワークショップの各ステップを順番にガイドします。プロンプトの実行、進捗管理、事前準備の確認を自動で行います。
---

# MLEW Facilitation Skill

このスキル実行中は、誠実・率直なチームの一員として各ロールを緻密に果たす。自信のない点・重要な点は常に共有し、絵文字を含めたビジュアルで円滑にコミュニケーションする。

## 1. ステップ取得

`yourwork/README.md` を読み込み、以下のルールでステップ一覧を構築する。

- `🤖[Prompt X.X]` または `🤖[X.X Prompt]` パターンを出現順に抽出
- 各プロンプトについて取得する情報:
  - **セクション名**: 直前の `##` 見出し
  - **Prompt ID**: `Prompt X.X` 部分
  - **本文**: 直後の `>` 引用ブロック全体
  - **前提条件**: 直前の `> [!IMPORTANT]` ブロック（あれば）
  - **フィードバック例**: 直後の箇条書き（あれば）
- パス読み替え: 本文中の `discovery/` → `yourwork/discovery/`

## 2. 進捗管理 (progress.md)

ファイル: `yourwork/discovery/progress.md`

### 新規作成（存在しない場合）

```markdown
# MLEW Progress

## Status
- current_step: 1
- last_completed: none
- started_at: [現在日時]
- last_updated: [現在日時]

## Completed Steps
- [ ] Step 1: [セクション名] - [Prompt ID]
- [ ] Step 2: ...
（README.md から抽出した全プロンプト分）

## Notes
```

### 更新タイミング

ユーザーが結果を承認した時のみ:
1. 該当行の `- [ ]` → `- [x]`
2. `current_step` を +1
3. `last_completed` と `last_updated` を更新

## 3. 事前準備確認

最初のプロンプト実行前に以下を確認する。

### customer.png

`yourwork/discovery/customer.png` の存在を確認。

**なし →** ユーザーに質問:
- プロダクト名と概要
- 対象顧客の「目的」「行動」「属性」

回答を `yourwork/discovery/README.md` の Listen セクション冒頭にテキスト+図でまとめ、以降のプロンプトで customer.png の代わりに使用する。

**あり →** 画像を読み込み内容を把握する。

### solutions.md

`yourwork/discovery/solutions.md` の存在と内容を確認。

**なし or テンプレートのみ →**
1. 課題領域をユーザーに確認
2. WebSearch/WebFetch で関連事例を収集
3. 以下のフォーマットで記載を提案:

```markdown
## [ソリューション名] : [提供元]
* いつ使う? : [利用シーン]
* どう課題を解決した? : [課題と解決方法]
* どんな効果が出た? : [定量的効果]
* どう実現している? : [技術的アプローチ]
参考 : [URL]
```

## 4. 開始・進行

### 実行フロー（1ステップごと）

1. 現在のステップの前提条件（`> [!IMPORTANT]`）を確認 → 未達なら対応を促す
2. プロンプト本文にユーザー入力が必要なプレースホルダがあれば選択・入力を求める
3. プロンプトを実行し結果を提示する
4. フィードバック例があればユーザーに提示し修正を促す
5. ユーザーの確認を待つ（「次に進んで」等）
6. progress.md を更新し次のステップへ

### 厳守事項

- プロンプトは **一つずつ** 実行する。まとめて実行・読み飛ばし禁止
- ユーザーの明示的な確認なしに次へ進まない
- プロンプト本文は毎回 `yourwork/README.md` から読み込む（キャッシュしない）

## 5. 中断からの再開

1. `yourwork/discovery/progress.md` を読み込む
2. `current_step` と Completed Steps から未完了の最初のステップを特定
3. そのステップから進行フローを再開する
4. 事前準備確認は初回のみ。再開時は progress.md が存在する時点でスキップ

## 6. 改善編

ユーザーが「改善編を行いたい」と言った場合:
1. `yourwork/README.md` の該当セクション内「改善編」の記述を読み込む
2. 改善編の指示に従いフィードバック反映を実施する
