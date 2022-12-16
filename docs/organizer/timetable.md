# ML Enablement Workshopのタイムテーブル例

ML Enablement Workshop開催者に向けて、 Day 1 ~ 3 のタイムテーブルの一例を提示します。

## Day 1

- 想定される実施時間
  - 5 時間
- 想定参加者
  - ビジネスサイド（プロダクトマネージャー）
- ゴール
  - プロダクトマネージャーが、ユーザーの課題のうち機械学習の適用可能性が最も高いユースケース 1 つを特定し、Event Storming に沿ったボードで開発チームに Day 3 で共有する準備を整えること。
-  準備物
   - オンラインホワイトボードツール(Miro)
   - ブレイクアウトルームが利用可能なオンライン会議システム

[Day1: 機械学習インプット](https://github.com/aws-samples/aws-ml-enablement-workshop#day1-%E6%A9%9F%E6%A2%B0%E5%AD%A6%E7%BF%92%E3%82%A4%E3%83%B3%E3%83%97%E3%83%83%E3%83%88)の資料を使用し進めます。

|進行時間|所要時間|次第|内容|
|:--|:--|:--|:--|
|13:00| 40 分 | 1. ML の入門 | [PDF](https://github.com/aws-samples/aws-ml-enablement-workshop/blob/main/docs/presentations/ml-enablement-workshop-module1.pdf) |
|13:40| 30 分 | 2. ML プロジェクトの計画 | [PDF](https://github.com/aws-samples/aws-ml-enablement-workshop/blob/main/docs/presentations/ml-enablement-workshop-module2.pdf) |
|14:10| 30 分 | 3. ML 活用組織へのシフト | [PDF](https://github.com/aws-samples/aws-ml-enablement-workshop/blob/main/docs/presentations/ml-enablement-workshop-module3.pdf) |
|14:40|15 分|休憩||
|14:55|25 分 | 4. アイデアソン解説(Day1用)| [PDF](https://github.com/aws-samples/aws-ml-enablement-workshop/blob/main/docs/presentations/ml-enablement-workshop-ideathon-day1.pdf) |
|15:20|60 分 | 5. Event Storming 演習 / 発表| [Miro](https://miro.com/app/board/uXjVOq7OXDo=/?moveToWidget=3458764540014205923&cot=14) |
|16:20|100 分| 6. 個社ワーク | [ML Usecase Discovery Worksheet](https://docs.google.com/spreadsheets/d/1Ob-bxF8ZDUn7RIOnR9S923MoFPuhbvcgjMpbXTr98Po/edit?usp=sharing) |

個社ワークではアイデアソンに向けてユーザーの業務と課題の洗い出しを進めてもらいます。WorksheetとボードはDay3で引き続き利用します。

## Day 2

- 想定される実施時間
  - 3 時間
- 想定参加者
  - ソフトウェア開発者
- ゴール
  - アプリケーション実装を担当する開発者に、機械学習モデルの開発プロセスと方法、必要なコミュニケーションをインプットする。Day 3 でのソフトウェア開発者の役割について理解いただく。
-  準備物
   - SageMaker Studio Labのアカウント
   - オンライン会議システム

|進行時間|所要時間|Process|内容|
|:--|:--|:--|:--|
|13:00|10分|Introduction|[ハンズオン資料](https://github.com/aws-samples/aws-ml-enablement-workshop/blob/main/docs/introduction.md)|
|13:10|30分|Environment Setup|[ハンズオン資料](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/00_environment_setup.ipynb)|
|13:40|20分|Business Understanding|[ハンズオン資料](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/01_business_understanding.ipynb)|
|14:00|30分|Analyze|[ハンズオン資料](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/02_analyze.ipynb)|
|14:30|15分|休憩| - |
|14:45| 5分|Prepare|[ハンズオン資料](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/03_prepare.ipynb)|
|14:50|25分|Preprocess|[ハンズオン資料](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/04_preprocess.ipynb)|
|15:15|15分|Train|[ハンズオン資料](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/05_train.ipynb)|
|15:30|20分|Test|[ハンズオン資料](https://studiolab.sagemaker.aws/import/github/aws-samples/aws-ml-enablement-handson/blob/main/notebooks/06_test.ipynb)|
|15:50|10分|Ending|[ハンズオン資料](https://github.com/aws-samples/aws-ml-enablement-workshop/blob/main/docs/ending.md)|

## Day 3

- 想定される実施時間
  - 4 時間
- 想定参加者
  - 全員
  - AI 知識を有するメンバーがファシリテーターとして参加することが望ましい
- ゴール
  - プロダクトマネージャー、開発者、データサイエンティストの 3 者で、プロダクトに不可欠な機械学習のユースケースを確認する。
-  準備物
   -  オンラインホワイトボードツール
   -  Day1の個社ワークで作成したボード
   - オンライン会議システム(複数チームの場合はブレイクアウトルームが利用可能であること)


|進行時間|所要時間|次第|内容|
|:--|:--|:--|:--|
|13:00|20 分|Event Storming の解説|[Event Storming 資料](https://github.com/aws-samples/aws-ml-enablement-workshop/blob/main/docs/presentations/ml-enablement-workshop-ideathon-day3.pdf)の説明|
|13:20|1 時間 30 分|As-is の整理|現状の課題を整理しボードに書き出す|
|14:50|10 分|休憩||
|15:00|1 時間 30 分|To-be の整理|ML ユースケースの特定を行う|
|16:30|30 分|ML ユースケースシート記入|特定された [ML ユースケースを ML Discovery Worksheet](https://github.com/aws-samples/aws-ml-enablement-workshop/blob/main/docs/presentations/ML_Usecase_Discovery_Worksheet.xlsx) に記入する|
