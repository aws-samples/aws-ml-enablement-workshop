# おわりに: 機械学習モデルの開発から運用へ

お疲れ様でした！本ハンズオンのゴールは、ソフトウェアエンジニアの方が、プロダクトへの機械学習導入プロジェクトを推進するのに必要最低限のビジネス的、技術的素養を習得することでした。本ハンズオンを得た知識を活かし、プロジェクトにおいて次の3つを実践いただければと思います。

1. Pythonで機械学習の基本的な実装を行えるようになる。
2. 開発に関わる他のステークホルダーに、Jupyter Notebookを提示しながら必要な確認をとれるようになる。
3. データサイエンティストに対し適切な声掛けができるようになる。

これにより、80%といわれる失敗の確率を下げることができるでしょう。

1. ビジネスの目標がはっきりしていない
   * `Business Understanding`のプロセスで、ユーザーの目線から機械学習後の価値を定義し、価値全体の中での機械学習の貢献分を計算式で定義した。
   * [Day3 アイデアソン](https://github.com/aws-samples/aws-ml-enablement-workshop#day3-%E3%82%A2%E3%82%A4%E3%83%87%E3%82%A2%E3%82%BD%E3%83%B3)で特に重要なパートになります。
2. データの品質が不十分
   * `Analyze`のプロセスで現在のデータが質・量の側面から価値を実現するのに十分であるか診断を行った。
   * `Prepare`のプロセスで、診断結果に基づきデータの収集・修正がなされている。
3. プロジェクトのスポンサーが不在
   * `Business Understanding`のプロセスで、プロダクトマネージャーがスポンサーに定義した価値を説明、共有する。
4. チーム間の連携が不十分
   * コミュニケーション演習を通じ、連携の仕方を学習。
   * `Business Understanding`のプロセスで機械学習の価値を計算式で表すことで、価値実現のための関係者が明確になり機械学習の精度達成がプロジェクトの失敗に直結することを抑えられている。
5. データサイエンティストなどの専門職の不在
   * 本ハンズオンでPythonで機械学習の基本的な実装を行えるようになり、開発に関わる他のステークホルダーにJupyter Notebookを提示しながら必要な確認をとれるようになった。データサイエンティストが採用された際は、データサイエンティストに対し適切な声掛けができる。

## 開発の規模拡大

本ハンズオンではStudio Labを用いましたが、実際はStudio Labを超えるデータ容量や計算リソースが必要になることもあるでしょう。その場合は、クラウド上のリソースを使うのが効率的です。各プロセスの「AWS Empowerment」を参照ください。[AI/ML Dark Partの動画シリーズ](https://www.youtube.com/playlist?list=PLAOq15s3RbuL32mYUphPDoeWKUiEUhcug)ではMLOpsの各プロセスをAmazon SageMakerで構築する方法を動画で解説しています。

## 運用への移行

機械学習モデルを開発した後は、プロダクション環境にデプロイし運用していくことになります。狭義のMLOpsと呼ばれる領域です。AWSを用いたMLOpsの構築については、[Amazon SageMakerでつくるMLOps -効率的な機械学習の開発・運用環境-](https://pages.awscloud.com/rs/112-TZM-766/images/attch_464048_533026_mp4_video_001_T2-4_MLT_AWS-Innovate-AIML_2022_deck.pdf)をご参照ください。

## Next Step

1. 学んだ内容を活かし、プロダクトマネージャーやデータサイエンティストらと機械学習の活用方法についてディスカッションしましょう。Day3で使用する[Event Storming](https://www.eventstorming.com/)は関係者を一堂に会し要件を話し合うのに適した手法です。
2. データサイエンティストがまだプロジェクトにいない場合、機械学習の知識を補完しながらモデルの開発にチャレンジしましょう。[awesome-studio-lab-jp](https://github.com/aws-sagemaker-jp/awesome-studio-lab-jp)に学習リソースが揃っています。
3. ハンズオンを通じて得られた学びを社内外で共有しましょう。[`Customer Cases`への掲載依頼](https://github.com/aws-samples/aws-ml-enablement-handson/issues/new?assignees=&labels=enhancement&template=case-study.md&title=)をお待ちしています！

## Reference

* [MLOps Practice](https://masatakashiwagi.github.io/mlops-practices/knowledge/)
