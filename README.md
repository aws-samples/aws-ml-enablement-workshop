# ML Enablement Workshop

[![security: bandit](https://img.shields.io/badge/security-bandit-yellow.svg)](https://github.com/PyCQA/bandit)

プロダクトを開発するチームが、**課題解決の選択肢として機械学習を選択できるようになること**をゴールとしたワークショップです。ワークショップは3部構成となっています。

1. 機械学習インプット(プロダクトマネージャ向け)
2. ハンズオン(開発者向け)
3. アイデアソン

3部構成のコンテンツは、機械学習プロジェクトをはじめるときに直面する3つの課題をそれぞれ解決するために作成されています。

🌧️ **Machine Learning Project Problems**
1. プロダクトマネージャーが機械学習を十分理解しておらず、機械学習を用いたプロダクト機能を発案できない。
2. 開発エンジニアに機械学習の知見がなく、研究開発部門から手取り足取りの支援が必要。
3. 研究開発部門がユーザー課題を認識できておらず、機械学習活用の適切な提案ができない。

**実践的**、**わかりやすい**、**無料**であることがコンテンツの特徴です。

* :dart: **実践的**
   * 機械学習インプット、ハンズオンではビジネスゴールの設定方法から解説([Business Understanding](https://youtu.be/csiMBxUkAEc))。
   * ハンズオンでは他のロールとコミュニケーションをとるための演習を実施。
   * アイデアソンではプロダクトマネージャー、開発者、データサイエンティスト全員が集まりユーザーの業務、課題を深掘り。
* :bulb: **わかりやすい**
   * 機械学習インプットは開発の知識を要求しない内容で解説。
   * ハンズオンでは、なにをするのか、なぜするのか、どうおこなうのか、順を追って工程の必然性を解説。YouTube動画で好きな時に学習可能(例: [機械学習の価値を計算する](https://youtu.be/csiMBxUkAEc))。
   * ハンズオンでは、インタラクティブなJupyter Notebookでデータの分析からテストまで各工程で必要となるPythonの基本的な実装を学習可能(例: [Analyze](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/02_analyze.ipynb), [Preprocess](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/04_preprocess.ipynb))。
* :octocat: **無料**
   * GitHubでOSSとして教材を公開。
   * ハンズオンに使用する[SageMaker Studio Lab](https://studiolab.sagemaker.aws/)も無料で利用が可能。
   * ライセンスの範囲でForkし編集して利用が可能。

## 機械学習インプット

プロダクトマネージャー向けに、機械学習の入門、プロジェクト計画、機械学習を活用できる組織へのシフト方法を解説する資料です。

|No   |Title|Content|
|:----|:----|:----|
|1    |MLの入門| [機械学習の仕組み、強みと弱み、適用事例などを解説 ![ml-enablement-workshop-module1.png](docs/images/ml-enablement-workshop-module1.png)](docs/presentations/ml-enablement-workshop-module1.pdf)  |
|2    |MLプロジェクトの計画 | [機械学習プロジェクトの進め方と、機械学習採用の判断基準を解説 ![ml-enablement-workshop-module2.png](docs/images/ml-enablement-workshop-module2.png)](docs/presentations/ml-enablement-workshop-module2.pdf)
|3    | ML活用組織へのシフト|[機械学習を推進するための組織とリーダーシップについて解説 ![ml-enablement-workshop-module3.png](docs/images/ml-enablement-workshop-module3.png)](docs/presentations/ml-enablement-workshop-module3.pdf) |

## ハンズオン

開発者向けの機械学習ハンズオン資料です。
目次のNo.1から順に進めていくことで各開発プロセスでなにを行うのか、なぜ行うのか、どう行うのかを学ぶことができます。

|No   |Process|Title|Content|Video|
|:----|:------|:----|:----|:----|
|1    |Introduction|機械学習モデル開発プロジェクトの進め方|[![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white)](docs/introduction.md)|[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://youtu.be/IEYAFbZhv80)|
|2    |Environment Setup|機械学習モデルの開発環境を構築する|[![Open in SageMaker Studio Lab](https://studiolab.sagemaker.aws/studiolab.svg)](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/00_environment_setup.ipynb)|[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://youtu.be/C8VYnJ-DF3I)|
|3    |Business Understanding|機械学習の価値を計算する|[![Open in SageMaker Studio Lab](https://studiolab.sagemaker.aws/studiolab.svg)](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/01_business_understanding.ipynb)|[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://youtu.be/csiMBxUkAEc)|
|4    |Analyze|データから価値を創出できるか診断する|[![Open in SageMaker Studio Lab](https://studiolab.sagemaker.aws/studiolab.svg)](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/02_analyze.ipynb)|[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://youtu.be/iYV4slOPoYE)|
|5    |Prepare|診断結果に基づきデータを充足する|[![Open in SageMaker Studio Lab](https://studiolab.sagemaker.aws/studiolab.svg)](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/03_prepare.ipynb)|[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://www.youtube.com/watch?v=Uwim4GSkSjw)|
|6    |Preprocess|機械学習モデルが認識しやすいデータにする|[![Open in SageMaker Studio Lab](https://studiolab.sagemaker.aws/studiolab.svg)](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/04_preprocess.ipynb)|(Comming Soon)|
|7    |Train|機械学習モデルを学習する|[![Open in SageMaker Studio Lab](https://studiolab.sagemaker.aws/studiolab.svg)](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/05_train.ipynb)|(Comming Soon)|
|8    |Test|機械学習モデルを評価する|[![Open in SageMaker Studio Lab](https://studiolab.sagemaker.aws/studiolab.svg)](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/06_test.ipynb)|(Comming Soon)|
|9    |Ending|機械学習モデルの開発から運用へ|[![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white)](docs/ending.md)|(Comming Soon)|

### ビジネス課題別シナリオ

実践的なビジネス課題を題材に機械学習モデル開発プロジェクトの進め方を体験できます。

* [サービスの解約率改善シナリオ](notebooks/scenario_churn)

## アイデアソン

プロダクトマネージャー、開発者、データサイエンティストの3者でユーザーの業務と課題を理解し、機械学習のユースケースを発見するアイデアソンを実施するための資料です。

(Comming Soon)

## 活用事例

(Comming Soon)

[Issue](https://github.com/aws-samples/aws-ml-enablement-handson/issues/new?assignees=&labels=enhancement&template=case-study.md&title=)から、ハンズオンを利用した事例をご連絡ください！

## Contribution

ハンズオンコンテンツについてのご要望や質問を歓迎します！事前に [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications)に目を通して頂ければ幸いです。

* ご要望/不具合: [GitHub Issue](https://github.com/aws-samples/aws-ml-enablement-handson/issues)
* ご質問: [GitHub Discussion](https://github.com/aws-samples/aws-ml-enablement-handson/discussions)
* セキュリティに関するご連絡: [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications)


## LICENSE

[MIT-0 License](LICENSE)
