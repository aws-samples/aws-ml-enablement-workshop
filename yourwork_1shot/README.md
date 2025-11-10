# Working Backwards 1-Shot Generator

このフォルダーは、AmazonのWorking Backwards手法に基づいて、生成AIが顧客起点のプロダクト開発を支援するツールセットです。

## 概要

Working Backwardsは、Amazonが実践する「顧客から逆算する」プロダクト開発手法です。このツールセットでは、顧客情報と既存ソリューションを入力するだけで、AIが以下を自動生成します：

- 📊 **カスタマージャーニー分析** (Phase 1)
- ❓ **問いの抽出** (Phase 2)
- 🎯 **課題の優先順位付け** (Phase 3)
- 🔧 **実装難易度評価** (Phase 4)
- 💡 **ブレイクスルーアイデア発明** (Phase 5)
- 📰 **PR/FAQ作成** (Phase 6)
- ✅ **モックアップ検証計画** (Phase 7)

## ファイル構成

```
yourwork_1shot/
├── discovery/
│   ├── customer.md         # ターゲット顧客の定義（目的・背景・属性）
│   ├── solutions.md        # 既存ソリューションの分析（4つ以上推奨）
│   └── output.md          # 生成されたPR/FAQ（AIが自動作成）
├── prompt/
│   ├── workingbackwards-prompt.md   # PR/FAQ生成用プロンプト
│   └── v0-mock-builder-prompt.md    # モックアップ生成用プロンプト
└── sample/                # 生成例（参考用）
    ├── ai_development_tool/
    ├── invoice_SaaS/
    └── security/
```

## 使い方

### ステップ1: 顧客を定義する

`discovery/customer.md` に以下を記載：
- **目的**: 顧客が達成したいこと
- **背景**: 顧客が直面している状況（具体的に）
- **属性**: 企業規模、フェーズ、意思決定権限など

### ステップ2: 既存ソリューションを調査する

`discovery/solutions.md` に以下を記載：
- いつ使う？（どんな状況で選ばれるか）
- どう課題を解決した？（解決のアプローチ）
- どんな効果が出た？（定量的な成果）
- どう実現している？（技術的な実装方法）

**最低4つ以上のソリューションを調査してください**

### ステップ3: AIにPR/FAQを生成させる

生成AIに以下を入力：

```
@discovery/customer.md と @discovery/solutions.md を読み込んで、
@prompt/workingbackwards-prompt.md の指示に従って
PR/FAQを生成してください。
```

AIが `discovery/README.md` に以下を順次生成します：
- Phase 1: カスタマージャーニー（Listen）
- Phase 2: 問いの抽出（Define）
- Phase 3: 課題の優先順位付け（Top 3）
- Phase 4: 実装難易度評価（solutions.mdに追記）
- Phase 5: ブレイクスルーアイデア（Invent）
- Phase 6: PR/FAQ（Refine）
- Phase 7: モックアップ検証計画（Validate）

### ステップ4: モックアップを作成する（オプション）

Phase 7の検証計画が完成したら、`v0-mock-builder-prompt.md` を使用してモックアップを生成できます。

## 出力例

生成されるPR/FAQには以下が含まれます：

✅ **プレスリリース本文**（Amazonスタイル）  
✅ **顧客向けFAQ**（15個以上）  
✅ **社内向けFAQ**（指針、運用指標、コスト削減戦略）  
✅ **モックアップ検証計画**（画面定義、仮説、成功基準）

## サンプル

`sample/` フォルダーに以下の生成例があります：

- **ai_development_tool**: AI開発支援ツールの事例
- **invoice_SaaS**: 請求書SaaSの事例
- **security**: セキュリティ製品の事例

これらを参考に、自分のプロダクトのPR/FAQを作成できます。

## Tips

💡 **品質を高めるコツ**
- `customer.md` の「背景」をできるだけ具体的に（実際の会話、数値を含める）
- `solutions.md` で「どんな効果が出た？」に定量データを入れる（○○%向上、○○時間削減など）
- Phase完了ごとに、AIが生成した内容をレビューし、必要に応じて修正を依頼する

## 開発期間

通常、Phase 1-7の完了までに**1-2時間**程度です。

---

**作成者向けメモ**: このツールセットは、aws-ml-enablement-workshopの一部として、プロダクト開発の初期段階（Day 0）でアイデアを言語化するために設計されています。

