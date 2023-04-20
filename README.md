# ML Enablement Workshop

[![security: bandit](https://img.shields.io/badge/security-bandit-yellow.svg)](https://github.com/PyCQA/bandit)

プロダクトマネージャーが、機械学習の「勝ちパターン」を実現するチームとロードマップが作れるワークショップです。

:books: **ML Enablement Workshop Content**

ワークショップは3部構成となっています。

1. [理解編: ベストプラクティスの理解](https://github.com/aws-samples/aws-ml-enablement-workshop#day1-%E6%A9%9F%E6%A2%B0%E5%AD%A6%E7%BF%92%E3%82%A4%E3%83%B3%E3%83%97%E3%83%83%E3%83%88)
2. [応用編: 顧客体験改善への応用](https://github.com/aws-samples/aws-ml-enablement-workshop#day2-%E3%83%8F%E3%83%B3%E3%82%BA%E3%82%AA%E3%83%B3)
3. [開始編: 顧客体験の改善を開始する](https://github.com/aws-samples/aws-ml-enablement-workshop#day3-%E3%82%A2%E3%82%A4%E3%83%87%E3%82%A2%E3%82%BD%E3%83%B3)

**理解編**で、機械学習の「勝ちパターン」とは何なのか、勝ちパターンが成立したベストプラクティス事例はどのようなものがあるのかを学びます。**応用編**で、ベストプラクティスの事例をもとに自身のプロダクトで勝ちパターンが成立するよう調整(=応用)します。**開始編**で、勝ちパターン成立に向け効果を確認しながら投資とチームを拡大できるよう、段階的なステップを設計します。

:gift: **ML Enablement Workshop Benefit**

ML Enablement Workshopを利用いただくメリットは3つです。

* 💪 **実践的**
   * AWSで機械学習の活用を支援したノウハウが詰め込まれています。ワークショップの提供から得られたつまづきや成功の知見、お客様からのフィードバックを随時反映し「活きた知見」を提供します。
* 🛠️ **実現性**
   * AWSのサービスとプログラムでロードマップの実現を支援します。無料で利用可能な[Amazon SageMaker Studio Lab](https://studiolab.sagemaker.aws/)や表計算ソフト間隔で使える[Amazon SageMaker Canvas](https://aws.amazon.com/jp/sagemaker/canvas)など、熟練したデータサイエンティストがいなくても機械学習が実装できるサービスを提供しています。AWSのエキスパートによるモデル構築支援を行う[ML Solutions Lab](https://aws.amazon.com/jp/ml-solutions-lab/)等も含め、サービスとプログラム両面で機械学習による勝ちパターンの実現を支援します。
* :octocat: **無料**
   * GitHubでOSSとして教材を公開しており、ライセンスの範囲で自由に利用頂くことができます。[ワークショップを開催するためのガイド](https://github.com/aws-samples/aws-ml-enablement-workshop#%E9%96%8B%E5%82%AC%E8%80%85%E5%90%91%E3%81%91%E3%82%AC%E3%82%A4%E3%83%89)も提供し、社内でのデータ活用推進などに活かしていただきます。

 :rocket: **ML Enablement Camp**

AWSのサービスやソリューションを活用し、数日での本番導入を目指すCampコンテンツを提供します。

* Amazon Personalize Prototyping Camp: プロダクトに推薦機能を実装するプログラム。(コンテンツ準備中)

## Day1: 機械学習インプット

プロダクトマネージャーの方に機械学習を理解いただくため、機械学習の入門、プロジェクト計画、機械学習を活用できる組織へのシフト方法の3つを解説します。解説の後、アイデアソンを実施するための準備を行います。
動画は[YouTubeの再生リストから視聴できます](https://www.youtube.com/playlist?list=PLAOq15s3RbuL5p1v3bSuWr_QVgCBW5wUG)。

プロダクトマネージャーの方は、アイデアソンでユーザーの業務と課題を開発者とデータサイエンティストにEvent Stormingで効果的に伝えて頂きます。当日ファシリテートができるよう、Event Stormingについて解説します。

|No   |Title|Content| Video |
|:----|:----|:----|:----|
|4    |アイデアソン解説(Day1用)| [アイデアソンで使用するEvent Stormingを解説 ![ml-enablement-workshop-ideathon-day1.png](docs/images/ml-enablement-workshop-ideathon-day1.png)](docs/presentations/ml-enablement-workshop-ideathon-day1.pdf)  | [![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://youtu.be/79fE0uv18Vc) |
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
|7    |Train|機械学習モデルを学習する|[![Open in SageMaker Studio Lab](https://studiolab.sagemaker.aws/studiolab.svg)](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/05_train.ipynb)|[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://youtu.be/-SzZJmZWmOs)|
|8    |Test|機械学習モデルを評価する|[![Open in SageMaker Studio Lab](https://studiolab.sagemaker.aws/studiolab.svg)](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/06_test.ipynb)|(Comming Soon)|
|9    |Ending|機械学習モデルの開発から運用へ|[![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white)](docs/ending.md)|(Comming Soon)|

### ビジネス課題別シナリオ

実践的なビジネス課題を題材に機械学習モデル開発プロジェクトの進め方を体験できます。

* [サービスの解約率改善シナリオ](notebooks/scenario_churn)

## Day3: アイデアソン

プロダクトマネージャー、開発者、データサイエンティストの3者でユーザーの業務と課題を理解し、機械学習のユースケースを発見するアイデアソンを実施するための資料です。Event Stormingのボード、後半で絞り込んだユースケースを書き込むワークシートはDay1で使用したものを継続して使用してください。

|No   |Title|Content|
|:----|:----|:----|
|1    |アイデアソン: 前半| [ユーザーの業務と課題、論理的な処理のまとまりを整理 ![ml-enablement-workshop-ideathon-day3-1.png](docs/images/ml-enablement-workshop-ideathon-day3-1.png)](docs/presentations/ml-enablement-workshop-ideathon-day3.pdf)  |
|2    |アイデアソン: 後半| [課題を解決する機械学習のユースケースを特定 ![ml-enablement-workshop-ideathon-day3-2.png](docs/images/ml-enablement-workshop-ideathon-day3-2.png)](docs/presentations/ml-enablement-workshop-ideathon-day3.pdf)  |

## 活用事例

<a href="https://corp.moneyforward.com/" target="_blcnk"><img src="docs/images/logo/MoneyForwardLogoMain.svg" width=320></a>

* [Money Forward](https://moneyforward.com/). **[ユーザに最高の付加価値を提供するための AI 活用に向けて](https://pages.awscloud.com/APAC_FIELD_T2_jp-isv-saas-on-aws-2022-archives-reg.html)**. [SaaS on AWS 2022](https://pages.awscloud.com/APAC_FIELD_T2_jp-isv-saas-on-aws-2022-day1-inperson-reg.html).
   * マネーフォワードでは 「Money Forwardクラウド」 の中長期の重要テーマとしてバックオフィス業務の自動・自律化を目指す 「Autonomous Backoffice」 を標榜し、AI 活用の取組みを進めています。推進するうえでの課題や課題に対する取組み、今後の展望についてお伝えするとともに、AI ユースケース創出のための取組みとして、AWS 支援による PdM を対象としたワークショップについてもご紹介します。

**様々なお客様のプロダクトチームで、ワークショップをご活用頂いています**

<a href="https://jp.sansan.com/" target="_blcnk"><img src="docs/images/logo/Sansan_Logo.png" width=320></a>

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
