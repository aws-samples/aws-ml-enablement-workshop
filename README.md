# ML Enablement Workshop

[![security: bandit](https://img.shields.io/badge/security-bandit-yellow.svg)](https://github.com/PyCQA/bandit)

プロダクトを開発するチームが、**課題解決の選択肢として機械学習を選択できるようになること**をゴールとしたワークショップです。

:books: **ML Enablement Workshop Content**

ワークショップは3部構成となっています。

1. [Day1: 機械学習インプット](https://github.com/aws-samples/aws-ml-enablement-workshop#day1-%E6%A9%9F%E6%A2%B0%E5%AD%A6%E7%BF%92%E3%82%A4%E3%83%B3%E3%83%97%E3%83%83%E3%83%88)
2. [Day2: ハンズオン](https://github.com/aws-samples/aws-ml-enablement-workshop#day2-%E3%83%8F%E3%83%B3%E3%82%BA%E3%82%AA%E3%83%B3)
3. [Day3: アイデアソン](https://github.com/aws-samples/aws-ml-enablement-workshop#day3-%E3%82%A2%E3%82%A4%E3%83%87%E3%82%A2%E3%82%BD%E3%83%B3)


:gift: **ML Enablement Workshop Benefit**

3部構成のコンテンツは、機械学習をプロダクトで活用する時の3つの課題をそれぞれ解決するために作成されています。

1. プロダクトマネージャーが機械学習を十分理解しておらず、機械学習を用いた機能を発案できない。
   * Day1ではプロダクトマネージャーを対象に機械学習に取り組む動機、計画の立て方、組織作りなどを解説します。
2. 開発エンジニアに機械学習の知見がなく、研究開発部門から手取り足取りの支援が必要。
   * Day2では開発者を対象に機械学習の実装に必要なプログラミングとプロジェクトを推進するためのコミュニケーションを学びます。
3. 研究開発部門がユーザー課題を認識できておらず、機械学習活用の適切な提案ができない。
   * Day3ではプロダクトマネージャー、開発者、研究開発者3者が集まりユーザーの課題を起点に機械学習の利用が適切なユースケースを発見します。

 :rocket: **ML Enablement Workshop Feature**

**実践的**、**わかりやすい**、**無料**であることがML Enablement Workshopの特徴です。

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
   * ライセンスの範囲で自由に利用が可能。教材を使用した[ワークショップを開催するためのガイド](https://github.com/aws-samples/aws-ml-enablement-workshop#%E9%96%8B%E5%82%AC%E8%80%85%E5%90%91%E3%81%91%E3%82%AC%E3%82%A4%E3%83%89)も提供。

## Day1: 機械学習インプット

プロダクトマネージャーの方に機械学習を理解いただくため、機械学習の入門、プロジェクト計画、機械学習を活用できる組織へのシフト方法の3つを解説します。解説の後、アイデアソンを実施するための準備を行います。
動画は[YouTubeの再生リストから視聴できます](https://www.youtube.com/playlist?list=PLAOq15s3RbuL5p1v3bSuWr_QVgCBW5wUG)。


|No   |Title|Content| Video |
|:----|:----|:----|:----|
|1    |MLの入門| [機械学習の仕組み、事例、制約などを解説 ![ml-enablement-workshop-module1.png](docs/images/ml-enablement-workshop-module1.png)](docs/presentations/ml-enablement-workshop-module1.pdf)  | [![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://youtu.be/1aX2Tf1SelE) |
|2    |MLプロジェクトの計画 | [ユースケースの発見方法と要件の確認方法を解説 ![ml-enablement-workshop-module2.png](docs/images/ml-enablement-workshop-module2.png)](docs/presentations/ml-enablement-workshop-module2.pdf)| [![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://youtu.be/Tj-RDb9Yd_U) |
|3    | ML活用組織へのシフト|[機械学習を推進するための組織戦略を解説 ![ml-enablement-workshop-module3.png](docs/images/ml-enablement-workshop-module3.png)](docs/presentations/ml-enablement-workshop-module3.pdf) | [![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://youtu.be/MQ1hgZ6qE_8) |

プロダクトマネージャーの方は、アイデアソンでユーザーの業務と課題を開発者とデータサイエンティストにEvent Stormingで効果的に伝えて頂きます。当日ファシリテートができるよう、Event Stormingについて解説します。

|No   |Title|Content| Video |
|:----|:----|:----|:----|
|4    |アイデアソン解説(Day1用)| [アイデアソンで使用するEvent Stormingを解説 ![ml-enablement-workshop-ideathon-day1.png](docs/images/ml-enablement-workshop-ideathon-day1.png)](docs/presentations/ml-enablement-workshop-ideathon-day1.pdf)  | [![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://youtu.be/FCjAl_Nnsa0) |
|5    |Event Storming演習 | [宿・ホテルサイトの体験改善を題材に、Event Stormingを実践 ![event-storming-board.png](docs/images/event-storming-board.png)](https://miro.com/app/board/uXjVOq7OXDo=/?moveToWidget=3458764540014205923&cot=14) |  |
|6    |個社ワーク | [ML Usecase Discovery Worksheetでユースケースを洗い出す等 ![ml-usecase-discovery-worksheet.png](docs/images/ml-usecase-discovery-worksheet.png)](https://docs.google.com/spreadsheets/d/1Ob-bxF8ZDUn7RIOnR9S923MoFPuhbvcgjMpbXTr98Po/edit?usp=sharing) |  |

個社ワークで使用するML Usecase Discovery Worksheetはコピーして使用してください。開けない場合、[Excel版](docs/presentations/ML_Usecase_Discovery_Worksheet.xlsx)をダウンロードして利用ください。


## Day2: ハンズオン

開発者向けの機械学習ハンズオン資料です。
目次のNo.1から順に進めていくことで各開発プロセスでなにを行うのか、なぜ行うのか、どう行うのかを学ぶことができます。ハンズオンは Amazon SageMaker Studio Lab を使用し進めます。アカウントの作成方法や使い方は[Amazon SageMaker Studio Lab の使い方](https://github.com/aws-sagemaker-jp/awesome-studio-lab-jp/blob/main/README_usage.md)を参照してください。

|No   |Process|Title|Content|Video|
|:----|:------|:----|:----|:----|
|1    |Introduction|機械学習モデル開発プロジェクトの進め方|[![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white)](docs/introduction.md)|[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://youtu.be/IEYAFbZhv80)|
|2    |Environment Setup|機械学習モデルの開発環境を構築する|[![Open in SageMaker Studio Lab](https://studiolab.sagemaker.aws/studiolab.svg)](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/00_environment_setup.ipynb)|[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://youtu.be/C8VYnJ-DF3I)|
|3    |Business Understanding|機械学習の価値を計算する|[![Open in SageMaker Studio Lab](https://studiolab.sagemaker.aws/studiolab.svg)](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/01_business_understanding.ipynb)|[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://youtu.be/csiMBxUkAEc)|
|4    |Analyze|データから価値を創出できるか診断する|[![Open in SageMaker Studio Lab](https://studiolab.sagemaker.aws/studiolab.svg)](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/02_analyze.ipynb)|[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://youtu.be/iYV4slOPoYE)|
|5    |Prepare|診断結果に基づきデータを充足する|[![Open in SageMaker Studio Lab](https://studiolab.sagemaker.aws/studiolab.svg)](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/03_prepare.ipynb)|[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://www.youtube.com/watch?v=Uwim4GSkSjw)|
|6    |Preprocess|機械学習モデルが認識しやすいデータにする|[![Open in SageMaker Studio Lab](https://studiolab.sagemaker.aws/studiolab.svg)](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/04_preprocess.ipynb)| [![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://youtu.be/T0Y0bFLfrsE) |
|7    |Train|機械学習モデルを学習する|[![Open in SageMaker Studio Lab](https://studiolab.sagemaker.aws/studiolab.svg)](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/05_train.ipynb)|(Comming Soon)|
|8    |Test|機械学習モデルを評価する|[![Open in SageMaker Studio Lab](https://studiolab.sagemaker.aws/studiolab.svg)](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/06_test.ipynb)|(Comming Soon)|
|9    |Ending|機械学習モデルの開発から運用へ|[![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white)](docs/ending.md)|(Comming Soon)|

### ビジネス課題別シナリオ

実践的なビジネス課題を題材に機械学習モデル開発プロジェクトの進め方を体験できます。

* [サービスの解約率改善シナリオ](notebooks/scenario_churn)

## Day3: アイデアソン

プロダクトマネージャー、開発者、データサイエンティストの3者でユーザーの業務と課題を理解し、機械学習のユースケースを発見するアイデアソンを実施するための資料です。

|No   |Title|Content|
|:----|:----|:----|
|1    | Event Storming準備 | [アイデアソンで使用するEvent Stormingのボードを準備します(※リンク先のボードをコピーして使用してください) ![event-storming-board.png](docs/images/event-storming-board.png)](https://miro.com/app/board/uXjVOq7OXDo=/?moveToWidget=3458764540015517738&cot=14) ![event-storming-board-copy.png](docs/images/event-storming-board-copy.png) |
|2    |アイデアソン: 前半| [アイデアソンの進め方を解説し、現状のユーザーの業務、課題、プロダクトのアプローチを整理 ![ml-enablement-workshop-ideathon-day3-1.png](docs/images/ml-enablement-workshop-ideathon-day3-1.png)](docs/presentations/ml-enablement-workshop-ideathon-day3.pdf)  |
|3    |アイデアソン: 後半| [機械学習が有効なユースケースの特定とアプローチ方法の定義 ![ml-enablement-workshop-ideathon-day3-2.png](docs/images/ml-enablement-workshop-ideathon-day3-2.png)](docs/presentations/ml-enablement-workshop-ideathon-day3.pdf)  |
|4    |ユースケース評価 | [ユースケースに、Event Stormingで検証した価値、また実現のための課題を反映します。![ml-usecase-discovery-worksheet-2.png](docs/images/ml-usecase-discovery-worksheet-2.png)](docs/presentations/ML_Usecase_Discovery_Worksheet.xlsx) |


## 活用事例

<a href="https://corp.moneyforward.com/" target="_blcnk"><img src="docs/images/logo/MoneyForwardLogoMain.svg" width=320></a>

* [Money Forward](https://moneyforward.com/). **[ユーザに最高の付加価値を提供するための AI 活用に向けて](https://pages.awscloud.com/APAC_FIELD_T2_jp-isv-saas-on-aws-2022-archives-reg.html)**. [SaaS on AWS 2022](https://pages.awscloud.com/APAC_FIELD_T2_jp-isv-saas-on-aws-2022-day1-inperson-reg.html).
   * マネーフォワードでは 「Money Forwardクラウド」 の中長期の重要テーマとしてバックオフィス業務の自動・自律化を目指す 「Autonomous Backoffice」 を標榜し、AI 活用の取組みを進めています。推進するうえでの課題や課題に対する取組み、今後の展望についてお伝えするとともに、AI ユースケース創出のための取組みとして、AWS 支援による PdM を対象としたワークショップについてもご紹介します。

**様々なお客様のプロダクトチームで、ワークショップをご活用頂いています**

<a href="https://jp.sansan.com/" target="_blcnk"><img src="docs/images/logo/SanSanLogo.png" width=320></a>

活用頂いた事例を掲載頂ける場合は、[Issue](https://github.com/aws-samples/aws-ml-enablement-handson/issues/new?assignees=&labels=enhancement&template=case-study.md&title=)よりご連絡ください。

## 開催者向けガイド

ML Enablement Workshopの教材を利用して、社内でワークショップを開催頂くことができます。

[開催者向けガイド](docs/organizer)

* [ライセンス](LICENSE)に従い、著作権者であるAWSを明記を頂くと共に著作権法に定める引用の要件を満たすようご利用ください。
* AWS以外の個人や法人が「ML Enablement Workshop」の名称もしくは同一とみなされる名称でワークショップを開催することを禁止します。お客様の混乱を防ぐための措置で、ご理解をお願い致します。

## Contribution

ハンズオンコンテンツについてのご要望や質問を歓迎します！事前に [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications)に目を通して頂ければ幸いです。

* ご要望/不具合: [GitHub Issue](https://github.com/aws-samples/aws-ml-enablement-handson/issues)
* ご質問: [GitHub Discussion](https://github.com/aws-samples/aws-ml-enablement-handson/discussions)
* セキュリティに関するご連絡: [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications)


## LICENSE

[MIT-0 License](LICENSE)
