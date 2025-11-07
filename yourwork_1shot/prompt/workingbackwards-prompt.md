<context_information>
<execution_instructions>
このプロンプトは順次実行型です。各フェーズを完了後、次のフェーズに進んでください。
各フェーズ完了時には、完了確認と品質チェックを行ってください。
</execution_instructions>

<team_capabilities>

1. チーム規模と役割構成: エンジニア10名
2. 技術スタック経験: AWSの実装経験あり
3. プロダクト開発経験: 0->1,1->10のプロダクト開発経験あり
4. 学習・適応能力: 新技術習得は可能だが、既存技術を優先
5. 開発期間・リソース: 6ヶ月、3名

</team_capabilities>

</context_information>

<execution_phases>
<phase1_tasks>
<role>
あなたはユーザーリサーチの専門家です。
</role>
<task>
discovery/customer.md に定義された顧客のうち、目的を達成できた顧客のインタビュー結果をまとめています。目的を達成できた顧客のインタビュー結果をまとめています。1)目的達成のために取った行動、2)行動に要したリソース(金額や時間など)、3)その時の感情の3点を時系列かつ定量的に表にまとめカスタマージャーニーを discovery/README.md の Listen セクションに記載してください。
加えて、各行動ステップで顧客が実際に口にしそうな言葉（ペインポイント）を引用形式で追記してください。
例：「Slackのメッセージが多すぎて、重要な情報を見逃してしまう」
</task>
<output_format>
| 行動ステップ | 所要時間 | 費用 | 使用ツール | 感情（1-5） | 課題 | 顧客の声 |
|------------|---------|------|-----------|-----------|------|---------|
| 1. チームコミュニケーションツール検討 | 2週間 | 0円 | - | 😟 3 | 選択肢が多すぎて決められない | 「Slackのメッセージが多すぎて...」 |
| 2. Slack導入 | 1日 | 10万円/年 | Slack | 😊 4 | 導入は簡単 | 「導入は簡単だったが...」 |
...
</output_format>

<completion_criteria>
このフェーズは以下の条件を全て満たした場合に完了とします：

【必須条件】
[] カスタマージャーニーが最低5ステップ以上定義されている
[] 全てのステップに定量的データ（所要時間・費用）が記載されている
[] 全てのステップに感情スコア（1-5）が付与されている
[] 全てのステップに「顧客の声」が引用形式で記載されている
[] 合計費用が年間10万円以上である（課題の重要性の指標）
[] 感情スコアが3以下の「ペインポイント」が3つ以上存在する

【品質基準】
[] 各ステップが時系列で論理的につながっている
[] 顧客の声が具体的で、実際のユーザーが言いそうな表現になっている
[] customer.md で定義された顧客の「目的」達成までの道のりが描かれている
[] 使用ツールが具体的な製品名・サービス名で記載されている

【次フェーズへの準備】
[] Phase2で問いを立てるのに十分な「非効率な行動」が3つ以上特定されている
[] 各行動の前後関係が明確で、Phase2での「同時にできない理由」分析が可能

このチェックリストを確認し、全ての項目にチェックが入ったことを宣言してから Phase2 に進んでください。
</completion_criteria>
</phase1_tasks>

<phase2_tasks>
<role>
あなたは貪欲な研究者として、顧客が常識と思う行動に対しても常に問いを投げかけます。
</role>
<task>
discovery/README.md の Listen セクションに記載されているユーザーの行動一つ一つについて、必要なリソースと前後の行動をもとに 2 種類の常識を疑う問いを立ててください。各行動に対し立てた問いを Define セクションに表にまとめてください。
* 「なぜ〇〇せずに□□ができないのか? 」
* 「なぜ○○と○○は同時にできないのか?」
</task>

<output_format>
| 行動ステップ | 問いの種類 | 問い | 現在の制約 |
|------------|-----------|------|-----------|
| 1. ツール検討 | 省略型 | なぜ事前調査せずにツールを決定できないのか? | 情報が散在している |
| 1. ツール検討 | 統合型 | なぜツール検討と試用は同時にできないのか? | 検討に時間がかかる |
...
</output_format>

<completion_criteria>
このフェーズは以下の条件を全て満たした場合に完了とします：

【必須条件】
[] Phase1で定義した全ての行動ステップに対して、最低2つの問い（省略型・統合型）が立てられている
[] 各問いに「現在の制約」が明記されている
[] 合計で最低10個以上の問いが生成されている
[] 全ての問いが「なぜ〇〇せずに□□ができないのか?」または「なぜ○○と○○は同時にできないのか?」の形式に従っている

【品質基準】
[] 問いが「当たり前を疑う」視点で立てられている（単なる機能改善要望ではない）
[] 各問いが具体的で、解決策をイメージできる
[] 「現在の制約」が技術的、組織的、心理的な障壁を明確に示している
[] 問いが顧客の実際のペインポイントに根ざしている（Phase1の「顧客の声」との関連が明確）

【次フェーズへの準備】
[] Phase3で優先順位付けするための「削減/獲得できるリソース」が推測可能
[] 各問いが独立していて、重複や包含関係がない

このチェックリストを確認し、全ての項目にチェックが入ったことを宣言してから Phase3 に進んでください。
</completion_criteria>
</phase2_tasks>

<phase3_tasks>
<task>
Define セクションでまとめた全ての問いについて、以下の評価軸で点数化し Top3 を選定してください：
- 削減/獲得できるリソース（時間・金額）：1-5点
- 顧客が直面する頻度（日次=5点/週次=3点/月次=1点）：1-5点
- 合計点の高い順に Top3 をランキングし、選定理由とともに Define セクションに追記してください。
</task>

<output_format>
### Top 3 重要課題

| 順位 | 問い | リソース削減効果 | 頻度 | 合計スコア | 選定理由 |
|------|------|----------------|------|-----------|---------|
| 1位 | なぜ... | 5点（週10時間削減） | 5点（毎日） | 10点 | CTOが最も頻繁に直面し、週10時間の削減が見込める |
| 2位 | なぜ... | 4点（月50万円削減） | 4点（週3回） | 8点 | ツールコスト削減効果が大きい |
| 3位 | なぜ... | 3点（週5時間削減） | 5点（毎日） | 8点 | 全メンバーが毎日直面する課題 |
</output_format>

<completion_criteria>
このフェーズは以下の条件を全て満たした場合に完了とします：

【必須条件】
[] Phase2で抽出した全ての問いに対してスコアリングが実施されている
[] 「リソース削減効果」と「頻度」の両方が定量的に評価されている
[] Top3が明確にランキングされ、合計スコアが記載されている
[] 各問いに選定理由が具体的に記載されている
[] 1位の問いの解決により、最低でも週5時間以上または月10万円以上の削減効果が見込まれる

【品質基準】
[] スコアリングが customer.md で定義された顧客の目的と整合している
[] 削減効果が具体的な数値で示されている（「大きい」などの曖昧表現ではない）
[] Top3の選定理由が、ビジネスインパクトと顧客価値の両面から説明されている
[] 頻度の評価が Phase1 のカスタマージャーニーの実態に基づいている

【次フェーズへの準備】
[] Top3の問いに対して、solutions.md の既存ソリューションで解決可能かが判断できる
[] 各問いの「現在の制約」が Phase5 での発明の方向性を示唆している

このチェックリストを確認し、全ての項目にチェックが入ったことを宣言してから Phase4 に進んでください。
</completion_criteria>
</phase3_tasks>

<phase4_tasks>
<role>
熟練の開発チームリーダーとして、discovery/solutions.md に並べられた機能を自社で実装する際の難易度を評価します。
</role>
<task>
難易度は 1, 3, 5, 10 の 4 段階とし、<team_capabilities></team_capabilities>の情報を元に評価を行ってください。結果は、難易度と理由を箇条書きに追加する形で discovery/solutions.md に記載してください。

難易度の基準：
- 1: <constraint>で定義された既存技術で1-2週間で実装可能
- 3: 既存技術で1-2ヶ月の実装期間が必要
- 5: 新規学習または複雑な統合が必要（2-4ヶ月）
- 10: 大規模な設計変更またはチーム拡大が必要（4ヶ月以上）
</task>

<output_format>
solutions.md の各ソリューションに以下を追記：

**自社実装難易度**: 5/10
**理由**:
- <constraint>で定義された技術スタックでリアルタイム共同編集を実現するには、深い理解が必要
- ドキュメント構造化には独自のデータモデル設計が必要（2ヶ月）
- API連携機能の実装に1ヶ月
- 合計3ヶ月の実装期間を想定（<constraint>の開発期間内に収まるか確認）
</output_format>

<completion_criteria>
このフェーズは以下の条件を全て満たした場合に完了とします：

【必須条件】
[] solutions.md の全てのソリューション（最低3つ）に難易度が付与されている
[] 各難易度に具体的な理由が3つ以上記載されている
[] 難易度が 1, 3, 5, 10 のいずれかである
[] 実装期間の見積もりが含まれている
[] <constraint>の開発期間を超えるものが明確に識別されている

【品質基準】
[] 評価が <constraint> で定義された技術スタックに基づいている
[] <constraint> で禁止されている新技術の学習が必要な場合、明確に指摘されている
[] <team_capabilities> で定義されたチーム規模を前提とした現実的な見積もりになっている
[] 難易度の理由に、フロントエンド・バックエンド・インフラの各側面が考慮されている
[] 外部サービス連携の複雑さが評価に含まれている

【次フェーズへの準備】
[] 難易度の合計から、実現可能なソリューション組み合わせの上限が見積もれる
[] <constraint>の開発期間内に実装可能なソリューションが最低2つ以上存在する

このチェックリストを確認し、全ての項目にチェックが入ったことを宣言してから Phase5 に進んでください。
</completion_criteria>

</phase4_tasks>

<phase5_tasks>
<task>
Phase3で選定した Top3 の問いそれぞれに対して、discovery/solutions.md に記載したソリューションを2-3個組み合わせた解決策を考案し、discovery/README.md の Invent セクションに追記してください。

**重要**: 提案する発明のうち、最低3つは以下の「ブレイクスルーアイデアフレームワーク」を適用した、あっと驚くような独自のアイデアを含めてください。

<breakthrough_idea_framework>
以下のいずれか（または複数）のアプローチを使用して、常識を覆すアイデアを生成してください：

1. **逆転の発想**: 常識とされる行動の「逆」をあえて行うことで価値を生む
   例: 「情報を整理する」→「情報を意図的に混在させて、セレンディピティを生む」

2. **異業種転用**: 全く異なる業界の成功パターンを適用する
   例: ゲーム業界のガチャ要素をB2B SaaSに適用、Netflix の推薦アルゴリズムをチーム編成に適用

3. **時間軸の操作**: 通常「後で」行うことを「先に」、「同時に」行うことを「分離」する
   例: 会議の議事録を会議「前」にAIが予測生成、意思決定と実行を完全分離

4. **制約の武器化**: 制約を「解決すべき問題」ではなく「差別化の源泉」として活用
   例: あえて機能を減らすことで使いやすさを実現、低予算を逆手に取った口コミ戦略

5. **感情の逆流**: ネガティブな感情をポジティブな体験に、ポジティブな体験にスパイスを
   例: エラー画面を楽しいゲームに変える、順調な時にあえて警告を出して緊張感を保つ

6. **AI/自動化の創造的活用**: 単なる効率化ではなく、人間にはできない新しい価値を創造
   例: AIが「人間らしくない」提案をあえてすることで、思考の幅を広げる
</breakthrough_idea_framework>

各発明には以下を含めてください：
- 対象となる問い（Phase3のTop3から）
- 組み合わせるソリューション名
- 新しい価値提案（既存ソリューションの単純な組み合わせを超えた独自性）
- **ブレイクスルー要素**（該当する場合：どのフレームワークを適用したか、なぜそれが驚きを生むか）
- 実装難易度（Phase4の難易度の合計）
- 実装期間の見積もり
</task>

<output_format>
## Invent: 発明

### 発明1: [サービス名] （通常の発明）

**解決する問い**: Phase3-2位「なぜ...」

**組み合わせるソリューション**:
- Notion の構造化ドキュメント機能（難易度: 5）
- Linear の高速インターフェース（難易度: 3）

**新しい価値提案**: 
既存のNotionは構造化に優れるが遅く、Linearは高速だがドキュメント管理が弱い。本サービスは、<constraint>で定義された技術スタックの特性を活かし、「構造化されたドキュメントを高速に編集・検索できる」体験を実現する。

**合計難易度**: 8/10
**実装期間**: 4ヶ月（<constraint>の開発期間内に収まることを確認）
**実現方法**:
- <constraint>で定義された技術スタックの機能を組み合わせて実現
- 具体的な実装方法と使用する機能を記載

**独自の差別化要素**:
- customer.md で定義されたペルソナに特化した機能
- 競合と比較した価格優位性や独自機能

---

### 発明2: [サービス名] 🎯**ブレイクスルーアイデア**

**解決する問い**: Phase3-1位「なぜ...」

**組み合わせるソリューション**:
- [ソリューションA]（難易度: X）
- [ソリューションB]（難易度: Y）

**新しい価値提案**: 
[通常の価値提案]

**🚀 ブレイクスルー要素**:
- **適用フレームワーク**: [逆転の発想/異業種転用/時間軸の操作/制約の武器化/感情の逆流/AI創造的活用]
- **なぜ驚くか**: [このアイデアが常識を覆す理由。具体的にどの「当たり前」を疑い、どんな新しい体験を生むか]
- **実例**: [類似のブレイクスルーアイデアの成功事例があれば記載]

**合計難易度**: X/10
**実装期間**: Xヶ月
**実現方法**:
- [具体的な実装方法]

**独自の差別化要素**:
- [従来にない体験価値]
- [競合が真似できない理由]
</output_format>

<completion_criteria>
このフェーズは以下の条件を全て満たした場合に完了とします：

【必須条件】
[] Phase3のTop3の問い全てに対して発明が提案されている（最低3つ）
[] 各発明に「新しい価値提案」が明確に記載されている
[] 各発明に実装難易度と実装期間が記載されている
[] 最低1つの発明が <constraint> の開発期間内に実装可能である
[] **最低3つの発明に「ブレイクスルー要素」が含まれている（🎯マーク付き）**

【品質基準】
[] 新しい価値提案が「既存ソリューションの単純な足し算」ではなく、独自の洞察に基づいている
[] customer.md で定義されたペルソナに特化した差別化要素がある
[] 実現方法が <constraint> で定義された技術スタックで具体的に説明されている
[] 価格や提供形態など、ビジネスモデルの要素が含まれている
[] 競合との差別化ポイントが明確に説明されている

【ブレイクスルーアイデアの品質基準】
[] ブレイクスルーアイデアが6つのフレームワークのうち最低1つを明確に適用している
[] 「なぜ驚くか」の説明が、具体的な「常識の覆し方」を示している
[] ブレイクスルー要素が実装可能な範囲内に収まっている（実現不可能な空想ではない）
[] 既存の競合が「思いつかなかった」または「実行できなかった」理由が説明されている
[] 読んだ人が「なるほど、その手があったか！」と感じられる内容になっている

【次フェーズへの準備】
[] Phase6でプレスリリースを書くのに十分な情報（顧客、課題、解決策、効果）が揃っている
[] 各発明が Phase1 のカスタマージャーニーのどのステップを改善するかが明確
[] 定量的な効果（Phase3のリソース削減効果）との紐付けが可能

このチェックリストを確認し、全ての項目にチェックが入ったことを宣言してから Phase6 に進んでください。
</completion_criteria>
</phase5_tasks>

<phase6_tasks>
<role>
あなたはAmazon の広報担当です。
</role>
<task>
discovery/README.md の Invent セクションにある発明について誠実なプレスリリースを執筆します。

**優先順位**: ブレイクスルーアイデア（🎯マーク付き）が存在する場合は、それを優先的にプレスリリースの対象として選択してください。ブレイクスルーアイデアの「驚き」を前面に押し出した内容にすることで、メディアやユーザーの注目を集めやすくします。

次のテンプレートにあるプレースフォルダを置き換える形で Refine のパートにプレスリリースの土台を執筆してください。
</task>
<template>

# [会社名]が[サービス名]をローンチ

### [Phase3-Top1の問いを解決する、1行の価値提案]

**[場所] – ([リリース日時])** – [会社名]は本日、[サービス名]を発表しました。[サービス名]は、[Phase3-Top1の問いに対する答えを、1-2文で簡潔に]。これまで、[Phase2のDefineで定義した「常識」]でしたが、[サービス名]はその常識を変え、[Phase5のInventで定義した新しい価値]を実現します。[サービス名]は、[技術的な独自性を1文で]により、[Phase3で算出した定量的な効果（削減時間・コスト）]を可能にします。[価格設定を簡潔に]。詳細は [URL] をご覧ください。

**参考：AWS Lambdaの実例**
> SEATTLE – (Nov XX, 2014) – Amazon Web Services LLC (AWS), an Amazon.com company (NASDAQ:AMZN), today announced the introduction of AWS Lambda, the simplest way to run code in the cloud. Previously, running code in the cloud meant creating a cloud service to host the application logic, and then operating the service, requiring developers to be experts in everything from automating failover to security to service reliability. Lambda eliminates the operational costs and learning curve for developers by turning any code into a secure, reliable and highly available cloud service with a web accessible end point within seconds.

---

_"[サービス名]によって、[Phase1のペインポイント]が解決されました"と、[顧客企業名]の[役職]は語ります。"私たちは[Phase1の具体的な状況]に苦しんでいました。[サービス名]を使うことで、[Phase3の定量的な効果]を達成でき、[Phase5の新しい価値提案による副次的効果]も得られました。これまで[Phase1の所要時間・コスト]を費やしていましたが、今では[削減後の時間・コスト]で済んでいます。"_

**参考：AWS Lambdaの実例**
> "Lambda has enabled us to deliver a world class cross device photo sharing app." says CTO of XXX. "We had great success with our app on iOS, hitting 1M downloads in 3 weeks, which led to a huge demand for the Android version. As we considered ways to leverage the cloud to make our app cross platform, we chose Lambda as the cost-effective choice to host our critical image processing logic. The support for JavaScript and Git made it easy for us to get our backend up and running within a few days. Previously, we would have incurred a huge management and operational overhead to maintain our user promise of fast and reliable response time for our customers as they access their pictures. With Lambda and AWS, we know we have the scale, stability and performance to support our customers even in periods of unpredictable demand."

---

[サービス名]の使い方はシンプルです。[Phase1のカスタマージャーニーを逆にたどる形で、3-5ステップで簡潔に記載]。[サービス名]は、[Phase5で組み合わせたソリューション]により、[customer.mdのペルソナ]が[Phase3-Top1の問いを解決する方法]を実現します。[サービス名]を使えば、[Phase1で要していた時間・コスト]から[削減後の時間・コスト]に削減でき、[Phase2のDefineで定義した「常識」を覆す新しい体験]が可能になります。

**参考：AWS Lambdaの実例**
> Using Lambda is simple. Developers express their application logic as they choose – as a one-line Python script, a Java application using native JNI libraries, or even a binary executable compiled from C or C++. When ready, developers can upload their code as a ZIP file, point Lambda to their Git repository, or author code directly from any browser using the AWS Console. Lambda makes it easy to write code that securely integrates other AWS services, with built in support for AWS SDKs and automatic integration with AWS Identity management (IAM) and Cognito Identity Broker. Lambda turns the code into a secure, highly available service within seconds that can be called from any connected device or app and requires no code or configuration changes to handle additional traffic.

---

_"[サービス名]は、私たちのチームが[Phase1の課題]を克服する加速剤となりました"と、[顧客企業名]の[役職]は語ります。"これまで[Phase1の具体的な非効率な行動]に時間を取られていましたが、[サービス名]によって[Phase3の定量的な効果]を実現できました。[Phase5のブレイクスルー要素がある場合は、その驚きを強調]。私たちの開発者は、[Phase1の運用負荷]から解放され、[Phase5の新しい価値提案による変化]に集中できるようになりました。[定量的な効果の具体例：時間削減、コスト削減、生産性向上など]を達成しています。"_

**参考：AWS Lambdaの実例**
> "Lambda has been an accelerator for my team to port and launch multiple services as we embrace the cloud." says Head of Corporate Development at XXX. "We have been using Lambda for everything from automating instant account balance updates based on customer trade notifications, to running nightly backups and scrubbing of transaction data to S3. Handling a mix of internal and external users typically presents security challenges, but Lambda incorporates a lot of AWS best practices and controls that makes it just as easy for us to securely connect to our data stored in AWS as well as our internal services."

---

## 顧客向けFAQ

### 一般（General）

**1. [サービス名]とは何ですか？**
[Phase5のInventで定義したサービスの概要を2-3文で]

**2. [サービス名]を使うメリットは何ですか？**
[Phase3で算出した定量的な効果と、Phase5の新しい価値提案を箇条書きで]

**3. [サービス名]はどのような顧客に向いていますか？**
[customer.mdで定義されたペルソナと、Phase1のカスタマージャーニーに基づいて]

**参考：AWS Lambdaの実例**
> **1. What is AWS Lambda?**
> AWS Lambda is a zero-administration compute platform for back-end web developers that runs your code for you in the AWS cloud, and provides you with a fine-grained pricing structure. AWS Lambda runs your back-end code on its own AWS compute fleet of Amazon EC2 instances across multiple Availability Zones in a region, which provides the high availability, security, performance, and scalability of the AWS infrastructure.

---

### 価格（Pricing）

**4. [サービス名]の価格はいくらですか？**
[具体的な価格プランを表形式で。Phase3のリソース削減効果と比較して投資回収期間を明示]

**5. 無料トライアルはありますか？**
[無料トライアルの有無、期間、制限事項]

**6. 既存の[競合製品]と比べてコストはどうですか？**
[Phase3で算出した既存ソリューションのコストと比較]

**参考：AWS Lambdaの実例**
> **5. How much does Lambda cost?**
> Lambda charges $0.20 per 1 million requests thereafter ($0.0000002 per request) and $0.00001667 for every GB-second used.

---

### はじめ方（Getting Started）

**7. [サービス名]を始めるにはどうすれば良いですか？**
[Phase1のカスタマージャーニーを逆にたどる形で、導入手順を3-5ステップで]

**8. 導入にどのくらい時間がかかりますか？**
[具体的な導入時間。Phase1の「導入前」と比較]

**9. 既存の[ツール名]との連携は可能ですか？**
[Phase5で組み合わせたソリューションとの連携方法]

**参考：AWS Lambdaの実例**
> **10. How do I get started with Lambda?**
> To use Lambda, you simply upload your code, and Lambda will be used to run your code on AWS infrastructure. You can invoke your application code manually, or you can configure an AWS event source to automatically trigger your code.

---

### [サービス名]の使用（Using [Service Name]）

**10. [サービス名]で何ができますか？**
[Phase5のInventで定義した機能を具体的に。customer.mdのペルソナのユースケースに基づいて]

**11. [Phase1の具体的な行動]を[サービス名]でどう改善できますか？**
[Phase2のDefineで立てた問いに対する答えを具体的に]

**12. [Phase5で組み合わせたソリューションA]との違いは何ですか？**
[競合比較を表形式で。Phase5の「独自の差別化要素」を強調]

**13. どのような[ツール/プラットフォーム]と連携できますか？**
[Phase5で組み合わせたソリューションを具体的に列挙]

**14. [サービス名]のセキュリティはどうなっていますか？**
[Phase5の実現方法で記載したセキュリティ対策を具体的に]

**参考：AWS Lambdaの実例**
> **11. What can I build with Lambda?**
> Lambda is designed to run many types of applications and back end services - all with zero administration. Lambda can execute code in response to events, such as changes to Amazon S3 buckets, updates to Amazon DynamoDB tables, or custom events generated by your applications or devices. This allows you to easily build data processing triggers for AWS services like Amazon S3 and Amazon DynamoDB, stream processing use cases (e.g. clickstream analysis), and mobile back ends that retrieve and transform data from DynamoDB.

---

### 制限と制約（Limits and Restrictions）

**15. [サービス名]には何か制限がありますか？**
[Phase5の実現方法で記載した技術的制約を正直に]

**16. [Phase1の具体的な行動]に対応していますか？**
[現時点での対応状況と、将来の対応予定]

**17. [具体的な規模：ユーザー数、データ量など]まで拡張できますか？**
[Phase5の実現方法で記載したスケーラビリティを具体的に]

**参考：AWS Lambdaの実例**
> **26. Are there restrictions on my application code?**
> Lambda is designed to run standard, common code from popular languages and libraries. Most code and language features are supported; a small number of system activities have restrictions. Lambda currently supports Java, Node.js, Python and Ruby; other language support will follow. AWS SDKs are pre-installed and available for each of these languages.

---

### パフォーマンス（Performance）

**18. [Phase1の具体的な行動]にかかる時間はどのくらいですか？**
[Phase3で算出した削減時間を具体的に。Phase1の「導入前」と比較]

**19. [Phase1の具体的な課題]はどのくらい改善されますか？**
[Phase3で算出した定量的な効果を%で]

**20. 応答速度はどのくらいですか？**
[Phase5の実現方法で記載したパフォーマンス指標を具体的に]

**参考：AWS Lambdaの実例**
> **29. What is the latency of invoking an application using the Lambda API?**
> Applications in steady use have typical latencies in the range of 20-50ms, determined by timing a simple "echo" application from a client hosted in Amazon EC2. Latency will be higher the first time an application is deployed and when an application has not been used recently.

---

## 社内向けFAQ（Internal FAQs）

### 1. いつ顧客に[サービス名]を勧める/勧めないべきですか？

**[サービス名]を勧めるべき顧客**:
- [customer.mdで定義されたペルソナ]
- [Phase1のカスタマージャーニーで特定された課題を持つ顧客]
- [Phase3-Top3の問いに該当する顧客]
- [Phase5の実現方法で定義された技術スタックを使用している顧客]

**[サービス名]を勧めるべきでない顧客**:
- [customer.mdで定義されたペルソナ以外]
- [Phase2のDefineで定義した「常識」に疑問を持たない顧客]
- [Phase5の実現方法で定義された技術的制約に引っかかる顧客]
- [<constraint>で定義された制約条件を超える要求を持つ顧客]

**参考：AWS Lambdaの実例**
> Mobile backends and any AWS service-embedded scripting uses (such as custom CloudWatch actions or custom video transcoder rules) will use Lambda "under the hood." Customers with these use cases will implicitly select this service.
>
> AWS event handlers and batch/cron jobs where the job is readily expressed as an application are good targets for Lambda. Customers with existing applications ("lift and shift"), those who want access to the underlying EC2 instances, who wish to write in languages other than those supported by the service, or who need "stateful" code cannot use Lambda and should target Beanstalk/EC2.

---

### 2. [サービス名]の指針（Tenets）は何ですか？

私たちの指針は、より良いものを知らない限り、以下の通りです：

* **[Phase5のInventで定義した最重要の価値提案]** – [その価値を実現するための指針を1-2文で]

* **[Phase3-Top1の問いに関連する指針]** – [Phase2のDefineで定義した「常識」を覆すための指針を1-2文で]

* **[Phase5の「ブレイクスルー要素」がある場合、そのフレームワークに関連する指針]** – [そのブレイクスルーを実現するための指針を1-2文で]

* **[customer.mdのペルソナに関連する指針]** – [Phase1のカスタマージャーニーで特定された課題を解決するための指針を1-2文で]

* **[<constraint>と<team_capabilities>に関連する指針]** – [実装可能性と拡張性を担保するための指針を1-2文で]

**参考：AWS Lambdaの実例**
> Our tenets, unless you know better ones, are:
> * **Security without complexity** – Our service will protect customer data from unauthorized access and will be resilient to attack.
> * **Simple and easy** – We will deliver a "NoOps" service that makes developers' lives easier by handling undifferentiated management and operational overhead for them.
> * **Scales up and down (to zero)** – Our service will scale customer applications without changes to their code or configuration.
> * **Cost effective at any scale** – Our service will target fine-grained pay-for-use; developers will not pay for idle time.
> * **AWS integration** – Our service will benefit from other AWS services by making them easy for application developers to access from within applications.
> * **Reliable** – Both our service and the applications running on it will provide predictable and reliable operational performance.

---

### 3. 顧客体験を改善するために測定・最適化する運用指標は何ですか？

私たちは、[サービス名]の顧客体験を以下の3つの重要な次元で最適化します：_[Phase3-Top1の問いに関連する指標1]_、_[Phase1のカスタマージャーニーで特定された課題に関連する指標2]_、_[Phase5の新しい価値提案に関連する指標3]_。また、4つ目の指標として[顧客満足度に関連する指標]を監視し、顧客体験を保護します。

**[指標1の名前]**
[Phase3で算出した定量的な効果を測定する方法。内部指標と顧客に公開する指標を区別]

**[指標2の名前]**
[Phase1のカスタマージャーニーで特定された課題の解決度合いを測定する方法]

**[指標3の名前]**
[Phase5の新しい価値提案の実現度合いを測定する方法]

**参考：AWS Lambdaの実例**
> We will seek to optimize three key dimensions of the customer experience for applications and applications running on Lambda: _latency_, _throughput_, and _availability_, and we will monitor a fourth, jitter, to protect customer experience.
>
> **Latency**: We plan to offer a _publicly_ visible measure of latency through a canary client running in EC2 that repeatedly invokes a Lambda-hosted 'echo' application. Monitoring and graphing the resulting latency from the client perspective offers a way to convey to developers the type of latency they will experience when using the service.

---

### 4. [サービス名]はどのようにして顧客のコストを削減できますか？

[サービス名]は、fine-grained（きめ細かい）な[Phase3の価格設定の単位]ベースの価格設定を提供します。[Phase3で算出した削減効果]により、顧客は[Phase1で費やしていた時間・コスト]から[削減後の時間・コスト]に削減できます。

**小〜中規模の顧客**は、[Phase5の「スケールダウン（ゼロまで）」に関する説明]の恩恵を受けます。[Phase1の具体的な状況：利用頻度が低い場合など]でも、[Phase5の新しい価値提案]を犠牲にすることなく、[Phase3の価格設定]で済みます。

**大規模顧客**は、[Phase5の実現方法で記載したスケーラビリティ]の恩恵を受けます。[Phase1のカスタマージャーニーで特定された課題：スパイキーなワークロード、異種混在のワークロードなど]も、[Phase5の新しい価値提案]により効率的に処理でき、[Phase3で算出した削減効果]を実現できます。

[サービス名]はまた、[Phase5で組み合わせたソリューション]を統合することで、[Phase1で要していた運用負荷]を削減し、TCO（総所有コスト）を下げることができます。[customer.mdのペルソナ]にとって、[Phase1の課題：予測不可能な需要、急速な変化など]は大きな課題でしたが、[サービス名]は[Phase5の新しい価値提案]により、[Phase3で算出した定量的な効果]を実現します。

**参考：AWS Lambdaの実例**
> Lambda offers fine-grained duration-based pricing. Like Amazon S3, it charges customers only for what they actually do with the service. Our pricing approach ensures that customers cannot overprovision or underutilize by design: customers utilize 100% of the computing power they're paying for when they run an application. Small and medium customers will benefit from the "scales to zero" aspect of the service, paying nothing at all for applications that are able to receive requests but not actually executing.
>
> Large customers benefit from Lambda's placement engine, which effectively compacts their workloads: Each new request is placed with respect to minimizing the number of instances dedicated to that account (subject to maintaining latency, throughput, and availability goals). Spiky workloads, heterogeneous workloads, and short-lived jobs such as cron or batch applications all use capacity efficiently without any additional IT oversight on the customer's behalf, potentially saving them money through higher utilization as well as reduced IT staffing needs.

---

</template>

<completion_criteria>
このフェーズは以下の条件を全て満たした場合に完了とします：

【必須条件：プレスリリース本文（AWS Lambda PR/FAQ形式）】
[] Phase5で選定した1つの発明についてプレスリリースが執筆されている
[] 見出し（会社名+サービス名+ローンチ）が明確
[] サブ見出し（1行の価値提案）が Phase3-Top1 の問いを解決する内容になっている
[] 第1段落（導入パラグラフ）に以下が含まれている
   - Phase3-Top1の問いに対する答え（1-2文で簡潔に）
   - Phase2のDefineで定義した「常識」
   - Phase5のInventで定義した新しい価値
   - 技術的な独自性（1文で）
   - Phase3で算出した定量的な効果
   - 価格設定（簡潔に）
   - URLまたは開始方法
[] 顧客の声が2つ含まれている
[] 各顧客の声に以下が含まれている
   - Phase1のペインポイント
   - Phase3の定量的な効果
   - Phase5の新しい価値提案による副次的効果
   - 削減前後の時間・コスト
[] 「使い方はシンプル」段落に以下が含まれている
   - Phase1のカスタマージャーニーを逆にたどる形の3-5ステップ（簡潔に）
   - Phase5で組み合わせたソリューション
   - customer.mdのペルソナ
   - Phase3-Top1の問いを解決する方法
   - 削減前後の時間・コスト

【必須条件：顧客向けFAQ】
[] 顧客向けFAQが最低15個以上含まれている
[] FAQが以下の6つのカテゴリに分類されている
   - 一般（General）：3個
   - 価格（Pricing）：3個
   - はじめ方（Getting Started）：3個
   - [サービス名]の使用（Using [Service Name]）：5個
   - 制限と制約（Limits and Restrictions）：3個
   - パフォーマンス（Performance）：3個
[] 各FAQの回答が具体的で、数値や具体例が含まれている
[] 「何ができますか？」に対する回答が customer.mdのペルソナのユースケースに基づいている
[] 価格に関する回答に Phase3のリソース削減効果との比較が含まれている
[] セキュリティに関する回答が Phase5の実現方法で記載したセキュリティ対策を反映している
[] 制限に関する回答が Phase5の実現方法で記載した技術的制約を正直に記載している

【必須条件：社内向けFAQ（Internal FAQs）】
[] 社内向けFAQが最低4つ含まれている
[] FAQ 1「いつ顧客に[サービス名]を勧める/勧めないべきですか？」に以下が含まれている
   - 勧めるべき顧客：customer.mdのペルソナ、Phase1の課題、Phase3-Top3の問い
   - 勧めるべきでない顧客：ペルソナ以外、Phase5の技術的制約、<constraint>を超える要求
[] FAQ 2「[サービス名]の指針（Tenets）は何ですか？」に以下が含まれている
   - Phase5のInventで定義した最重要の価値提案
   - Phase3-Top1の問いに関連する指針
   - customer.mdのペルソナに関連する指針
   - <constraint>と<team_capabilities>に関連する指針
   - 各指針に「より良いものを知らない限り」という前提
[] FAQ 3「顧客体験を改善するために測定・最適化する運用指標は何ですか？」に以下が含まれている
   - Phase3-Top1の問いに関連する指標
   - Phase1のカスタマージャーニーで特定された課題に関連する指標
   - Phase5の新しい価値提案に関連する指標
   - 各指標の測定方法（内部指標と顧客に公開する指標の区別）
[] FAQ 4「[サービス名]はどのようにして顧客のコストを削減できますか？」に以下が含まれている
   - Phase3の価格設定の単位
   - Phase3で算出した削減効果
   - 小〜中規模の顧客への恩恵
   - 大規模顧客への恩恵
   - TCO削減の説明

【品質基準：Amazon PR/FAQ形式の遵守】
[] AWS LambdaのPR/FAQと同様の構造になっている（プレスリリース→顧客向けFAQ→社内向けFAQ）
[] プレスリリース本文が簡潔で、3-4段落にまとまっている（詳細はFAQに）
[] 顧客の声が実際のユーザーが言いそうな具体的な表現になっている
[] FAQが「顧客が実際に持つであろう疑問」に答えている
[] 社内向けFAQが「チームの意思決定に必要な情報」を提供している
[] テンプレートの各所に「AWS Lambdaの実例」が参考として記載されている

【品質基準：具体性と定量性】
[] プレスリリース全体が customer.md で定義されたペルソナに向けて書かれている
[] 定量的な効果が以下の形で具体的に示されている
   - 削減時間（週X時間、年間Y時間）
   - 削減費用（年間Z万円）
   - 削減率（X%削減）
   - 投資回収期間（Xヶ月）
[] 全ての数値が Phase1 と Phase3 のデータに基づいている
[] 「誰が読んでも同じ認識を持てる」レベルの具体性がある（曖昧な表現が0個）

【品質基準：顧客視点の徹底】
[] 技術的詳細より、顧客の得られる価値が強調されている
[] 「なぜこのサービスが必要か」が Phase2 の問いと紐付いて説明されている
[] 読んだ人が「これは自分のための製品だ」と感じられる内容になっている
[] ブレイクスルーアイデアの場合、「常識の覆し方」が前面に押し出されている

【品質基準：実装可能性の担保】
[] サービスの説明が <constraint> と <team_capabilities> で実装可能な内容である
[] 価格設定が Phase3 のリソース削減効果と整合している（投資回収期間が合理的）
[] セキュリティ・制限の説明が現実的である
[] 社内向けFAQ「勧めるべきでない顧客」が <constraint> の制約を反映している

【次フェーズへの準備】
[] Phase7で事業計画を立てるのに必要な「提供価値」が明確
[] ターゲット市場規模を推定するための情報が含まれている（顧客向けFAQ「どのような顧客に向いていますか？」）
[] 成功指標（North Star Metric）につながる行動指標が社内向けFAQ「測定する運用指標」に含まれている

このチェックリストを確認し、全ての項目にチェックが入ったことを宣言してから Phase7 に進んでください。
</completion_criteria>
</phase6_tasks>

<phase7_tasks>
<role>
あなたはAmazon の事業統括者です。
</role>
<task>
discovery/README.md の Refine セクションにあるプレスリリースについて会社としてのメッセージ、社内向けの FAQ を追記してください。
</task>
<template>

## 提供者メッセージ
これまで [Define : ××するのに××する] ことによる影響は見過ごされていました。☆☆市場では約☆☆社 / 人のお客様がこの課題を抱えていると推計しています。私達株式会社○○は[♡♡の独自技術 / データ、パートナーシップ、販路、資金力etc] を活かし今後 N 年で♡♡社のお客様での導入を目指します。

## 社内向け FAQ
Q: リリース後、いつ開発の継続を検討しますか ?
A : リリース後半年で行います

Q: 継続の意思決定に使用する目標値と値は ?
A: 導入顧客数 100 を目指します

Q: 競争優位性をどのように評価しますか?
A: 導入後 N ヵ月で X 回以上機能を利用していることを評価します

Q: 成功指標（North Star Metric）は何ですか？
A: [Phase3で選定したTop1の問いに関連する行動指標]

Q: 各フェーズでモニタリングする指標は？
A: 
- リリース後1ヶ月: [アクティベーション指標]
- リリース後3ヶ月: [エンゲージメント指標]
- リリース後6ヶ月: [リテンション指標]

</template>

<completion_criteria>
このフェーズは以下の条件を全て満たした場合に完了とします：

【必須条件】
[] 提供者メッセージが記載されている
[] ターゲット市場規模が具体的な数値で推定されている
[] N年後の導入目標が明記されている
[] 社内向けFAQが5つ以上含まれている
[] 成功指標（North Star Metric）が定義されている
[] 各フェーズ（1ヶ月/3ヶ月/6ヶ月）でモニタリングする指標が定義されている

【品質基準】
[] 市場規模の推定が論理的な根拠に基づいている（例: ターゲット企業数 × customer.mdで定義されたペルソナの割合 × ツール予算）
[] 導入目標が現実的である（市場規模の1-10%程度）
[] 成功指標が Phase3-1位の問いの解決度合いを測定できる
[] モニタリング指標が「先行指標」→「エンゲージメント指標」→「リテンション指標」と段階的に設定されている
[] 競争優位性の評価基準が具体的である（「N回以上利用」など）

【事業計画の完成度】
[] 継続判断のタイミングと基準が明確
[] 独自の強み（技術/データ/パートナーシップ等）が明記されている
[] リスク要因と対応策が検討されている（オプション：FAQ に含めることを推奨）
[] 収益モデルが Phase6 の価格設定と整合している

【全体の整合性チェック】
[] Phase1（Listen）→ Phase7（Refine）まで一貫したストーリーになっている
[] 定量的な目標値が Phase1 と Phase3 のデータに基づいている
[] <constraint> で定義された制約条件が全体のロードマップに反映されている

このチェックリストを確認し、全ての項目にチェックが入ったことを宣言して完了してください。

【最終確認】
全7フェーズ完了後、discovery/README.md を通読し、以下を確認してください：
- Listen/Define/Invent/Refine の各セクションが完成している
- 顧客の課題から事業計画まで、一貫した論理でつながっている
- <constraint> と <team_capabilities> で定義された実装可能性が担保されている
</completion_criteria>
</phase7_tasks>


</execution_phases>