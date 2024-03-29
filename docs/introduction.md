# Introduction: 機械学習モデル開発プロジェクトの進め方

## ハンズオンのゴール

**ソフトウェアエンジニア**の方が、プロダクトへの機械学習導入プロジェクトを推進するのに必要最低限のビジネス的、技術的素養を習得することがゴールです。具体的には次の3つのアクションが取れるようになって頂きたいと思います。

1. Pythonで機械学習の基本的な実装を行えるようになる。
2. 開発に関わる他のステークホルダーに、Jupyter Notebookを提示しながら必要な確認をとれるようになる。
3. データサイエンティストに対し適切な声掛けができるようになる。

本ハンズオンではデータサイエンスの専門的な知識を身に着けることはできませんが、専門知識を持つデータサイエンティストやビジネスゴールを設定するプロダクトマネージャーとコミュニケーションするための技術的・ビジネス的素養を獲得できます。

## ハンズオン受講前の確認事項

ハンズオン受講前に、ハンズオンから学びたいものが学べるかご確認ください。

* 機械学習の知識をお持ちの方にとってプログラミング演習は既知の内容と思います。[ビジネス面の解説(Business Understanding)](https://github.com/aws-samples/aws-ml-enablement-workshop/blob/main/notebooks/01_business_understanding.ipynb)、コミュニケーション演習など非技術的要素がご自身にとって有益か検討したうえで参加ください。
* プログラミング経験があるソフトウェアエンジニアの方を対象としています。ハンズオンではPythonを使用しますが、Pythonを直接学んだことがなくとも他のプログラミング言語の知識があれば類推できる内容は解説していません。具体的には変数への代入やクラスのメソッド呼び出し方法などです。プログラミング経験がない方は、解説がないことを前提に有益か判断し参加ください。Pythonのプログラミングについて学びたい方は[Python早見帳](https://aws.amazon.com/jp/blogs/news/python-hayamicho-is-available-in-sagemaker-studio-lab/)等をご参照ください。
* ハンズオンでは機械学習アルゴリズムの理論的な解説は行っていませんのでご了承ください。理論的な内容を学びたい方は[機械学習帳の学習ノート](https://github.com/icoxfog417/mlnote-note)等をご参照ください。深層学習に関心がある方は[ゼロから作る Deep Learning](https://github.com/oreilly-japan/deep-learning-from-scratch)等をご参照ください。
* ハンズオンはプロジェクトの進め方に重点を置いているため、コーディングの時間は多くありません。機械学習の実装について学びたい方は[Machine Learning University](https://aws.amazon.com/jp/machine-learning/mlu/)等をご参照ください。Machine Learning Universityでは、Final Projectで実践的な課題に取り組むことができます。
* ハンズオンではSageMakerは使用しません。SageMakerの使い方に関心がある方は、[AI/ML Dark Partの動画シリーズ](https://www.youtube.com/playlist?list=PLAOq15s3RbuL32mYUphPDoeWKUiEUhcug)をご参照ください。

## ハンズオンの内容

機械学習モデルの要件確認から運用監視までを10のプロセスで定義し、そのうち「開発」にあたる6つのプロセスを本教材の対象としています。次の図では、既存のソフトウェア開発プロセスをDevOpsとし、機械学習モデルの開発プロセスをMLOpsとし上下に分けて示しています。本教材の対象は、図のオレンジの枠で囲った箇所です。

![introduction_001](./images/introduction_001.PNG)

| 英語名                 | 日本語名     | なにをするのか                             |
|------------------------|--------------|---------------------------------------|
| Business Understanding | ビジネス理解 | プロダクトの顧客が理解できる言葉で、機械学習後の価値を定義する。機械学習による価値を計算式で記述する。 |
| Analyze                | データ分析   | 今あるデータの質・量がBusiness Understandingで決めた価値を実現するのに十分か診断する。                       |
| Prepare                | データ準備   | Analyzeの診断結果に基づき、データの質・量を充足させる。   |
| Preprocess             | 前処理       | Prepareで用意したデータを、機械学習モデルが認識しやすいデータに変換する。 |
| Train                  | 学習         | Business Understandingで定めた機械学習の用途と、Preprocessで用意したデータに合わせて機械学習モデルを選択し、学習する。   |
| Test                   | テスト       | Trainで作成したモデルがBusiness Understandingで定義した価値を生むか、モデル、サービス、システムのレベルで確認する。 |

各プロセスの学習時間は10~20分程度です。[`README.md`](../README.md)の目次に沿い自習形式でも進められますが、チームメンバーと一緒に行うことでより実践的なコミュニケーション演習ができます。

各プロセスの解説は、**なにをするのか**、**なぜやるのか**、**どうやるのか**の3つから構成されます。どうやるのかは、**プログラミング演習**と**コミュニケーション演習**の2つから構成されます。

1. なにをするのか
2. なぜやるのか
3. どうやるのか
   * プログラミング演習
   * コミュニケーション演習

プログラミング演習ではPythonを用いた基本的な機械学習モデルの構築を行います。

コミュニケーション演習では、「プロジェクトで機械学習を担当することになったソフトウェアエンジニア」として、各開発プロセスで他のロールの方とどのようにコミュニケーションをとればよいのかを学びます。

コミュニケーション演習が入っている理由は、機械学習の導入プロジェクトが失敗する理由にあります。機械学習の導入プロジェクトは[80%が失敗する](https://research.aimultiple.com/ai-fail/)といわれています。失敗の理由として技術よりもコミュニケーションに起因する原因がランクインしています。

1. **ビジネスの目標がはっきりしていない**
2. データの品質が不十分
3. **プロジェクトのスポンサーが不在**
4. **チーム間の連携が不十分**
5. データサイエンティストなどの専門職の不在

次の図は最初に提示したDevOpsとMLOpsが並走する開発プロセスにおいて、担当するロールをマッピングした図です。全部で18のロールがあり、幅広いロールとコミュニケーションをとることが不可欠なことがわかります。

(皆さんが普段コミュニケーションをとるロールはあるでしょうか?)

![introduction_002](./images/introduction_002.PNG)

| 英語名             | 日本語名                   | 役割                                                                 |
|--------------------|----------------------------|----------------------------------------------------------------------|
| Product Manager    | プロダクトマネージャー     | ユーザー体験を向上させるために実装すべきソフトウェア機能を定義する。 |
| Business Analyst   | ビジネスアナリスト         | 解決すべきビジネス上の問題を定義する                                 |
| Data Analyst       | データアナリスト           | データの可視化と分析で問題を定量的に特定する。                       |
| Architect          | アーキテクト               | ソフトウェアアーキテクチャ全体を設計する。                           |
| DevOps Engineer    | DevOpsエンジニア           | ソフトウェアの開発・運用プロセスを自動化する。                       |
| Software Engineer  | ソフトウェアエンジニア     | ソフトウェアの開発を行う。                                           |
| Operator           | 業務担当者                 | ソフトウェアを利用し業務を行う。                                     |
| System Admin       | システム管理者             | サービスの挙動を監視する。                                           |
| IT Auditor         | IT監督者                   | システムや会社全体の権限管理や監査を行う。                           |
| Data architect     | データアーキテクト         | データを管理する基盤を設計、運用する。                               |
| Domain Expert      | 業務有識者                 | 深い業務知識を持ちデータの意味やあるべき状態について定義する。       |
| Data Engineer      | データエンジニア           | 機械学習モデルに入力可能なデータと特徴を作成する。                   |
| Data Scientist     | データサイエンティスト     | 機械学習モデルを開発する。                                           |
| ML Engineer        | 機械学習エンジニア         | 機械学習モデルを本番環境にデプロイ可能な形式に変換する。             |
| ML Operator        | 業務担当者(機械学習側)     | 推論結果に基づき業務を行いつつ、フィードバックを与える。             |
| Model risk Manager | 機械学習モデルリスク管理者 | 機械学習モデルの推論の挙動を監視する。                               |
| MLOps Engineer     | MLOpsエンジニア            | 機械学習モデルの開発・運用プロセスを自動化する。                     |
| AI/ML Architect    | AI/MLアーキテクト          | 機械学習モデル開発に必要なアーキテクチャ全体を設計する。  

## Next Step

ハンズオンではメールアドレスのみかつ無料でJupyterLab環境が扱える[Amazon SageMaker Studio Lab](https://studiolab.sagemaker.aws/)を使用します。アカウントがない場合は、[Request Account](https://bit.ly/3OZJEFv)より作成できます。

準備ができたら、機械学習モデルの開発を始める前の、環境構築から始めていきます。

[Environmental Setup](../notebooks/00_environment_setup.ipynb)

## References

1. Takahiro Kubo. [MLOpsのこれまでとこれから](https://speakerdeck.com/icoxfog417/mlopsfalsekoremadetokorekara). 2022.
2. 一般社団法人データサイエンティスト協会. [データサイエンティストの採用に関するアンケート](https://www.datascientist.or.jp/common/docs/corporate_research2021.pdf). 2022.
3. IPA. [AI白書2020](https://www.ipa.go.jp/ikc/publish/ai_hakusyo.html). 2020.
