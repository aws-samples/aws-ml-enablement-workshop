# モックアプリ デプロイメントガイド（Nx Plugin for AWS）

## 概要

このガイドでは、[Nx Plugin for AWS](https://awslabs.github.io/nx-plugin-for-aws/) でモックアプリを生成し、AWS にデプロイして削除するまでの手順を説明します。成果物は `yourwork/product/` に作ります。

- ランディングページ（`/`）とアプリ本体（`/app` 配下）を 1 つの website プロジェクトで管理します。
- インフラは生成された CDK のコードをそのまま使い、設定は公開 props で渡します。CSP・WAF・checkov は生成物の既定値に任せ、KMS キーだけは削除できるものを公開 props の `encryptionKey` で渡します（手順 6）。
- デプロイ先リージョンと AWS のプロファイルは、plugin の stage 設定（infra の generator の `--stageConfig`）で生成される `packages/common/infra-config/src/stages.config.ts` に書いて固定します（手順 5）。生成された `main.ts` はこの設定を読むので、書き換えません。シェルの環境変数には頼りません。
- コマンドの書き方（シェルによる違い）は [`AGENTS.md` の「シェルの扱い」](/yourwork/AGENTS.md#シェルの扱い) に従います。
- 計測（Tracker）の組み込みは [MLEW Tracker 導入ガイド](/yourwork/template/TRACKER_INTEGRATION_GUIDE.md) に従います。

## 技術スタック

| 用途 | 採用技術 |
| --- | --- |
| フロントエンド | React + TypeScript |
| ビルドツール | Vite |
| ルーティング | TanStack Router（ファイルベース、`packages/website/src/routes/`） |
| UI | shadcn（`packages/common/shadcn`）+ Tailwind CSS v4 |
| 品質チェック | Biome（format / lint）、Vitest、checkov（infra） |
| インフラ | AWS CDK（Nx の infra プロジェクト） |
| ホスティング | S3 + CloudFront + AWS WAF + KMS（WAF は us-east-1 の別スタック） |

## 前提条件

着手前に、次をすべて確認します。満たしていない項目があれば、着手せずユーザーに伝えます。バージョンの根拠は [`AGENTS.md` の「検証済みバージョン」](/yourwork/AGENTS.md#検証済みバージョン) にあります。

| 項目 | 条件・確認方法 |
| --- | --- |
| Node.js | Node.js 22.13 以上（推奨: 24 LTS）。`node --version` で確認します |
| pnpm | `pnpm --version` のメジャーバージョンが [`AGENTS.md` の「検証済みバージョン」](/yourwork/AGENTS.md#検証済みバージョン) の pnpm と一致すること（12 系）。違う場合は、`npm install -g pnpm@<そのメジャーバージョン>` で入れ直し、ターミナルを開き直して `pnpm --version` をもう一度確かめるようユーザーに伝えます（corepack などの別の pnpm が先に見つかると、入れ直しても切り替わりません）。依存が `catalog:` 指定のため、npm では install できません |
| uv | 0.5.29 以上。`uv --version` で確認します。infra の build に含まれる checkov を `uvx` で実行するため、無いと `uvx: command not found` で build が失敗します |
| AWS CLI v2 と認証情報 | デプロイに使う AWS のプロファイル名をユーザーに確認し、`aws sts get-caller-identity --profile <プロファイル名>` が成功すること。プロファイルの一覧は `aws configure list-profiles` で出せます（`aws configure` だけで設定した場合は `default`）。以降の `aws` コマンドには、すべて `--profile <プロファイル名>` を付けます |
| us-east-1 が使えること | CloudFront 用の WAF は us-east-1 にしか作れないため、SCP などで us-east-1 が制限されていないことを確認します。`aws cloudformation list-stacks --profile <プロファイル名> --region us-east-1 --max-items 1 --query "length(StackSummaries)" --output json` がエラーにならなければ使えます（参加者向けの準備ガイドと同じコマンドです）。出力の数字は削除済みのスタックも数えるので、判断には使いません。出力形式が text だと、us-east-1 が使える場合でもこのコマンドはエラーになるため、`--output json` は省略しません。`AccessDenied` などのエラーになる場合は、組織の管理者に確認するようユーザーに伝えます。読み取りが通っても書き込みだけが制限されている場合があるため、企業のアカウントでは事前確認の段階でデプロイまで通しておきます |

CDK bootstrap はこの時点では不要です。手順 5 でデプロイ先リージョンを `stages.config.ts` に書き、手順 8 の build が通ったあとに、手順 9 で行います。

## リージョンの決め方

モック本体のデプロイ先リージョンは、次の順に決めます。一度決めた値は、bootstrap・デプロイ・削除のすべてで使い続けます。

1. `product/packages/common/infra-config/src/stages.config.ts` の `product-infra-sandbox` に `region` があれば、その値。デプロイに使われるのはこの値なので、`product/construction/plan.md` の記録と食い違っていたら、こちらを正として `plan.md` を直します
2. 無ければ、`product/construction/plan.md` に記録された値
3. 無ければ、`aws configure get region --profile <プロファイル名>` の値と、シェルの環境変数 `AWS_REGION` の値を候補にして、`aws cloudformation describe-stacks --profile <プロファイル名> --region <候補> --stack-name product-infra-sandbox-Application --query "Stacks[0].StackStatus" --output text` で既存のスタックを探し、見つかったリージョン
4. 無ければ、`aws configure get region --profile <プロファイル名>` の値
5. それも空なら、推測せずユーザーに尋ねる

- 決めた値はプロファイル名と一緒に控えておき、ワークスペースを生成したあとで `product/construction/plan.md` に記録します（`product/` を生成より前に作らないため）。
- 2 回目以降に別のリージョンでデプロイすると、us-east-1 の WAF スタックの更新が `UPDATE_FAILED` になります（「トラブルシューティング」参照）。同じアカウントに既存のスタックがあるかを上の 3 で探すのはこのためです。
- WAF は常に us-east-1 の別スタックに作られます。
- Tracker は別のリージョンにあっても構いません。エンドポイント URL で指定するだけです。

## 生成されるディレクトリ構造

```
yourwork/product/
├── nx.json                         # Nx の設定（手順 4 で useDaemonProcess を追加する）
├── package.json
├── pnpm-workspace.yaml
├── construction/
│   └── plan.md                     # デプロイ先リージョンと実装計画（生成後に作る）
└── packages/
    ├── website/                    # React アプリ（LP とアプリ本体）
    │   ├── index.html
    │   ├── public/                 # 画像などの静的ファイル
    │   └── src/
    │       ├── main.tsx            # エントリポイント
    │       ├── config.ts           # アプリ名と Tracker の接続情報
    │       ├── styles.css          # テーマ（Tailwind v4）
    │       └── routes/             # TanStack Router のルート
    ├── infra/                      # CDK アプリ
    │   └── src/
    │       ├── main.ts             # 生成のまま（stages.config.ts の設定を読む）
    │       └── stacks/
    │           └── application-stack.ts  # Website と KMS キーを追加する
    └── common/
        ├── constructs/             # 生成された共通 CDK コンストラクト（書き換えない）
        ├── infra-config/
        │   └── src/
        │       └── stages.config.ts  # デプロイ先リージョンとプロファイルを書く
        ├── scripts/                # deploy / destroy でプロファイルを適用するスクリプト（書き換えない）
        └── shadcn/                 # shadcn の UI コンポーネントと globals.css
```

Tracker の固定ファイルと接続コードを置く場所は、[MLEW Tracker 導入ガイド](/yourwork/template/TRACKER_INTEGRATION_GUIDE.md) を参照してください。

## 手順

`yourwork/` で始めます。

**再実行するとき**は、手順 1〜6 のそれぞれについて結果がすでにあるかを確かめ、無いものだけ実行します。`product/nx.json` は手順 1 で作られるので、それだけで「生成済み」と判断すると、手順 2〜6 の途中で失敗した状態を見落とします（たとえば手順 4 が抜けると、古いビルドが黙ってデプロイされます）。

| 手順 | 飛ばしてよい条件 |
| --- | --- |
| 1 | `product/nx.json` がある |
| 2 | `pnpm nx show projects` の出力に `@product/website` と `@product/infra` の両方がある（片方だけなら、無いほうの generator だけ実行します）。`@product/infra` があるのに `packages/common/infra-config/` が無いときは、`--stageConfig` なしで生成されています。`product/` を消してよいかユーザーに確認してから作り直します |
| 3 | 飛ばさない（何度実行しても結果は変わりません） |
| 4 | `nx.json` のトップレベルに `"useDaemonProcess": false` がある |
| 5 | `stages.config.ts` の `product-infra-sandbox` に、デプロイ先リージョンの `region` とプロファイルの `credentials` がある |
| 6 | `application-stack.ts` で `Website` に `encryptionKey` を渡している |

`product/` はあるのに `product/nx.json` が無いときは、手順 1 が途中で失敗しています。`product/` を消してよいかユーザーに確認してから作り直します。

### 1. ワークスペースを生成する

`yourwork/` で次を実行します。バージョンは [`AGENTS.md` の「検証済みバージョン」](/yourwork/AGENTS.md#検証済みバージョン) と揃えます。`product/` は事前に作りません。

```
pnpm create @aws/nx-workspace@1.0.6 product --iac=cdk --no-interactive
```

生成が終わったら、`product/construction/plan.md` を作り、「リージョンの決め方」で決めたデプロイ先リージョンと、前提条件で確認したプロファイル名を記録します。

### 2. website と infra を生成する

以降はすべて `product/` で実行します。

```
pnpm nx g @aws/nx-plugin:ts#website website --no-interactive
pnpm nx g @aws/nx-plugin:ts#infra infra --stageConfig --no-interactive
```

`--stageConfig` を付けると、デプロイ先のリージョンとプロファイルを設定ファイル（手順 5）で渡せる形の infra が生成されます。

### 3. 同期する

```
pnpm nx sync
```

generator を実行したあとは、TypeScript のプロジェクト参照の同期が必要になることがあります。同期しないと build が「The workspace is out of sync」で止まります。

### 4. Nx デーモンを無効にする

`nx.json` のトップレベルに `"useDaemonProcess": false` を追加します。

`product/` は親リポジトリの `.gitignore` 対象のため、Nx デーモンがソースの変更を検知できません。デーモンが有効なままだと、変更後もキャッシュが使われ、古いビルドがデプロイされます。

### 5. デプロイ先リージョンとプロファイルを stages.config.ts に書く

`packages/common/infra-config/src/stages.config.ts` の `projects` に、次のエントリを追加します。`main.ts` は生成のまま使います（`--stageConfig` で生成された `main.ts` は、この設定から `region` を読みます）。

```ts
  projects: {
    'packages/infra': {
      stages: {
        'product-infra-sandbox': {
          credentials: { type: 'profile', profile: '<プロファイル名>' },
          region: '<デプロイ先リージョン>',
        },
      },
    },
  },
```

- `packages/infra` は infra プロジェクトのパス、`product-infra-sandbox` は `main.ts` の `ApplicationStage` の名前です。
- `credentials` は型で必須です（省くと build が `@product/common-infra-config:compile` で失敗します）。前提条件で確認したプロファイル名を書きます。`deploy-sandbox` と `destroy-sandbox` は、このプロファイルで cdk を実行します。
- 生成直後の `region` は、実行時のシェルの環境変数やプロファイルから決まります。エージェントのシェルにはエージェント自身の設定に由来する `AWS_REGION` が入っていることがあり、そのままだと意図しないリージョンにデプロイされます。ここで固定すれば、bootstrap・デプロイ・削除のリージョンがシェルの環境変数に左右されません。

### 6. application-stack.ts に Website と KMS キーを追加する

生成直後の `ApplicationStack` は空で、このままデプロイしても何も作られません。`packages/infra/src/stacks/application-stack.ts` を次のようにします。

```ts
import { Website } from '@product/common-constructs';
import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Construct } from 'constructs';

export class ApplicationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // destroy で削除されるキー（Website が自動で作るキーは削除後も残り、課金が続くため）
    const encryptionKey = new Key(this, 'WebsiteKey', {
      enableKeyRotation: true,
      removalPolicy: RemovalPolicy.DESTROY,
      pendingWindow: Duration.days(7),
    });

    new Website(this, 'Website', { encryptionKey });
  }
}
```

- KMS キーは `Website` の公開 props `encryptionKey` で渡します。生成された共通コンストラクト（`packages/common/constructs/`）は書き換えません。
- CSP は生成された既定値のまま使います。Tracker の SDK はモックと同じオリジンから配信するので、CSP の変更は不要です。

### 7. 画面と Tracker を実装する

- 画面は `packages/website/src/routes/` に作ります。生成物の既知の問題（レイアウト、404、`lang` など）は「既知の問題への対処」を確認します。
- Tracker の値（API Endpoint / API Key）を受け取っている場合は、[MLEW Tracker 導入ガイド](/yourwork/template/TRACKER_INTEGRATION_GUIDE.md) の `## 固定ファイル` をコピーし、`## 接続コード` を書きます。ユーザーが Tracker を使わないと明示した場合は、どちらも行いません（SDK の script タグも置きません）。あとから Tracker を使うことになったら、組み込んでから手順 10 のデプロイを再実行します。
- 画像は `packages/website/public/` に置き、`/image.png` のような直接パスで参照します。外部 URL の画像や外部フォント（Google Fonts など）は、生成された CSP によりデプロイ後にブロックされます。`pnpm dev` では表示されるので気付きにくい点に注意してください。

### 8. ビルドする

```
pnpm install
pnpm nx run-many -t build
```

build には Biome、Vitest、infra の synth と checkov が含まれます。整形漏れで失敗したら `pnpm lint` で自動修正してから、もう一度ビルドします。

### 9. CDK bootstrap（アカウント×リージョンごとに初回のみ）

```
pnpm nx bootstrap infra -- --profile <プロファイル名>
```

生成された `bootstrap` ターゲットは `stages.config.ts` のプロファイルを使わないので、`--profile` を付けます（`--` の後ろが cdk に渡ります）。アカウント ID などの引数を付けない `cdk bootstrap` は、アプリを合成し、そのスタックのデプロイ先の環境をすべて bootstrap します。合成には website の bundle（`dist/packages/website/bundle`）が要るので、手順 8 の build が一度通ってから実行します（無いと `CannotFindAsset` で失敗します）。手順 5 で `stages.config.ts` に `region` を書いているので、対象はデプロイ先リージョンと WAF 用の us-east-1 の 2 つで、シェルの `AWS_REGION` には左右されません。すでに bootstrap 済みの環境では何も変わりません。事前確認と当日で同じリージョンを使えば、当日にやり直す必要はありません。

### 10. デプロイする

```
pnpm nx deploy-sandbox infra
```

デプロイ先とプロファイルは `stages.config.ts` で決まるので、コマンドにリージョンやプロファイルを付ける必要はありません。デプロイすると次の 2 スタックが作られます。初回デプロイは 4 分前後かかります。

| スタック | リージョン |
| --- | --- |
| `product-infra-sandbox-Application` | デプロイ先リージョン |
| `product-infra-sandbox-ApplicationWebsitewaf...` | us-east-1 |

デプロイ完了時に CDK の Outputs に出る `...WebsiteDistributionDomainName...` の値（`xxxx.cloudfront.net`）がアクセス先です。あとから確認するときは次を実行します。

```
aws cloudformation describe-stacks --profile <プロファイル名> --region <デプロイ先リージョン> --stack-name product-infra-sandbox-Application --query "Stacks[0].Outputs" --output table
```

アプリを更新したときも、`pnpm nx deploy-sandbox infra` を再実行するだけです。

## セキュリティ設定

CSP と WAF は生成物の既定値を使い、KMS キーは手順 6 で削除できるものを渡します。モック作りで意識するのは次の 2 点です。

- 外部の script・画像・フォントは読み込めません。Tracker の SDK はモックに同梱し、画像は `public/` に置き、フォントはローカルのものを使います。
- インライン script は実行されません。Tracker の初期化は TypeScript のコードで行います（[MLEW Tracker 導入ガイド](/yourwork/template/TRACKER_INTEGRATION_GUIDE.md)）。

CloudFront には us-east-1 の Web ACL（`AWSManagedRulesCommonRuleSet` と `AWSManagedRulesKnownBadInputsRuleSet`）が関連付けられます。S3 バケットは非公開で CloudFront 経由でのみアクセスされ、手順 6 で作った KMS キーで暗号化されます。

## 費用

| 項目 | 月額（us-east-1 単価） |
| --- | --- |
| WAF Web ACL | $5 |
| WAF ルール 2 個 | $2 |
| KMS キー | $1 |
| 合計 | **約 $8 / 月 / デプロイ** |

- 固定費は時間割りで課金されます。1 週間で削除すれば約 $2 です。
- リクエスト課金は、モック程度のアクセスならほぼ $0 です。
- 置いておくだけで費用がかかるので、使い終わったら削除してください。

## 削除

ユーザーから明示的な削除指示があった場合にのみ実行します。

### モックのスタックを削除する

1. `product/` で `pnpm nx destroy-sandbox infra -- --force` を実行します。削除先とプロファイルは `stages.config.ts` で決まります。`destroy-sandbox` の中身は確認付きの `cdk destroy` で、TTY の無いエージェントのシェルでは確認できずに `TtyNotAttached` で失敗するため、`--force` を付けます（`--` の後ろが cdk に渡ります。PowerShell での扱いは [`AGENTS.md` の「シェルの扱い」](/yourwork/AGENTS.md#シェルの扱い)）。S3 バケットは autoDeleteObjects 付きなので、手で空にする必要はありません。
2. デプロイ先リージョンと us-east-1 の両方で次を実行し、どちらも出力が空であることを確認します。WAF のスタックは us-east-1 にあるため、デプロイ先だけを見ると取り残しに気付けません。状態で絞り込まず存在で確認するのは、`DELETE_FAILED` や `UPDATE_ROLLBACK_COMPLETE` のスタックを見落とさないためです。
   ```
   aws cloudformation describe-stacks --profile <プロファイル名> --region <デプロイ先リージョン> --query "Stacks[?starts_with(StackName,'product-infra-sandbox-')].[StackName,StackStatus]" --output table
   aws cloudformation describe-stacks --profile <プロファイル名> --region us-east-1 --query "Stacks[?starts_with(StackName,'product-infra-sandbox-')].[StackName,StackStatus]" --output table
   ```
3. KMS キーは 7 日後に削除されます。削除待ちの間は課金されません。

### CDKToolkit スタック（bootstrap で作られたもの）

モックのスタックを削除しても、bootstrap で作られた `CDKToolkit` スタックは残ります。残るリージョンは、デプロイ先リージョン、us-east-1、Tracker のリージョン（Tracker のデプロイ時に CodeBuild が bootstrap します）です。中身は CloudFormation の実行ロール（管理者権限）などの IAM ロール、ステージング用の S3 バケット（バージョニング有効）、ECR リポジトリで、費用はほぼかかりません。

ユーザーが不要と判断したときだけ削除します。削除する前に、そのリージョンでほかの CDK アプリが CDKToolkit を使っていないことを確かめます。

1. 削除したいリージョンで次を実行し、CDK でデプロイされたスタックの一覧を出します。
   ```
   aws cloudformation describe-stacks --profile <プロファイル名> --region <リージョン> --query "Stacks[?Parameters[?ParameterKey=='BootstrapVersion']].StackName" --output text
   ```
   出力が空でなければ、そのリージョンの CDKToolkit はまだ使われています（Tracker のリージョンでは、Tracker を削除するまで `MLEWTrackerStack-<env>` が出ます）。削除せず、出たスタック名をユーザーに伝えます。このパラメータを持たないスタック（古い synthesizer でデプロイしたものなど）はこの一覧に出ないので、空でも、ほかに CDK アプリをデプロイしていないかユーザーに確認します。
2. 出力が空なら、ステージング用のバケット名を控えてからスタックを削除します。
   ```
   aws cloudformation describe-stacks --profile <プロファイル名> --region <リージョン> --stack-name CDKToolkit --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" --output text
   aws cloudformation delete-stack --profile <プロファイル名> --region <リージョン> --stack-name CDKToolkit
   ```
   `aws cloudformation describe-stacks --profile <プロファイル名> --region <リージョン> --stack-name CDKToolkit` が `does not exist` のエラーを返せば、削除は完了です。削除は非同期なので、`DELETE_IN_PROGRESS` の間は待ちます。`DELETE_FAILED` になったら、ユーザーに伝えます。
3. ステージング用のバケット（`cdk-hnb659fds-assets-<アカウント ID>-<リージョン>`）はスタックを削除しても残ります。バージョニングが有効なので、すべてのバージョンと削除マーカーを消して空にしてからバケットを削除します（`aws s3 rb --force` はバージョン付きのオブジェクトを消さないので、それだけではバケットが空にならず削除に失敗します）。空にする前に、ユーザーに削除してよいか確認します。

CDKToolkit を削除したリージョンに再びデプロイするときは、手順 9 の bootstrap からやり直します。

## ローカル開発

すべて `product/` 直下で実行します。

| 目的 | コマンド |
| --- | --- |
| 依存インストール | `pnpm install` |
| ローカル確認 | `pnpm dev`（website は http://localhost:4200） |
| 本番ビルドの確認 | `pnpm nx run @product/website:preview`（http://localhost:4300） |
| ビルド | `pnpm nx run-many -t build` |
| テスト | `pnpm nx run-many -t test` |
| 整形・lint の自動修正 | `pnpm lint` |

外部 URL の画像やフォントは `pnpm dev` では表示されても、デプロイ後は CSP でブロックされます。最終確認はデプロイ先の URL で行います。

## トラブルシューティング

### 変更したのに古いビルドがデプロイされる

Nx デーモンがソース変更を検知せず、キャッシュが使われています。`nx.json` に `"useDaemonProcess": false` があるか確認し、無ければ追加してから再デプロイします。

### Biome のエラーで build が失敗する

整形漏れや lint 違反です。`pnpm lint` で自動修正してから、もう一度ビルドします。

### `uvx: command not found` で build が失敗する

infra の checkov が uv を必要とします。uv をインストールしてから、もう一度ビルドします。

### deploy で bootstrap のエラーが出る

対象のアカウント×リージョンが CDK bootstrap されていません。`product/` で `pnpm nx bootstrap infra -- --profile <プロファイル名>` を実行してから、もう一度デプロイします。

### 意図しないリージョンにデプロイされる

`packages/common/infra-config/src/stages.config.ts` の `product-infra-sandbox` に `region` があるか確認します（手順 5）。エントリが無いと、`main.ts` はシェルの環境変数（`CDK_DEFAULT_REGION`）でリージョンを決めます。

### 再デプロイで WAF スタックが `UPDATE_FAILED` になる

`Cannot delete export ...WebAclArn... as it is in use by product-infra-sandbox-Application` が出る場合は、前回と別のリージョンで合成されています。CDK がリージョンをまたぐ参照に切り替え、既存スタックが使っている export を削除しようとして拒否されます。`stages.config.ts` の `region` を既存の `product-infra-sandbox-Application` があるリージョンに戻して再デプロイすると解消します。失敗した時点ではリソースは変更されていません。

## 既知の問題への対処（@aws/nx-plugin 1.0.6 で確認）

ここにあるのは、`@aws/nx-plugin` 1.0.6 の生成物で確認した問題と対処です。各項目は「X なら Y する」の形で書いているので、条件に当てはまらなければ何もしません。**plugin のバージョンを上げたら、この節の各項目がまだ当てはまるかを見直し、直った項目は削除します**（あわせて [`AGENTS.md` の「検証済みバージョン」](/yourwork/AGENTS.md#検証済みバージョン) を更新します）。

### 生成時

- **`pnpm create` の途中で husky の `.git can't be found` が出たら**、無視して進めます。`product/` が親リポジトリの管理外なだけで、生成には影響しません。

### 画面（website）

- **生成された `routes/__root.tsx` が全ルートをサイドバー付きの `AppLayout` で包んでいたら**（LP にもサイドバーが出る）、`__root.tsx` は `<Outlet />` だけにし、`AppLayout` は `routes/app/route.tsx`（`/app` 配下のレイアウト）で使います。
- **存在しない URL で英語の「Not Found」だけが出たら**、`__root.tsx` の `notFoundComponent` に日本語の 404 と、トップへ戻る Link を置きます（計測は Tracker ガイドの計測対象に従います）。
- **`packages/website/index.html` が `lang="en"` なら**、`lang="ja"` に変え、`<title>` と `description` もプロダクトに合わせます。
- **`AppLayout` のパンくずがクエリ文字列を `?` なしで連結していたら**（`/appscenario=x` のようなリンクになる）、`URLSearchParams` を使って `?` 付きで組み立て直します。パンくずに URL の区切り（`app` など）が英語のまま出ていたら、画面名の日本語ラベルに置き換えます。
- **`packages/website/src/styles.css` が `@import` と `@source` の 2 行だけなら**、テーマの既定値は `packages/common/shadcn/src/styles/globals.css` にあります。色などの上書きは `packages/website/src/styles.css` に `@theme` / `:root` を追記して行い、ベーススタイルは `@layer base` 内に書きます。Tailwind CSS v4 は設定を CSS 側で行うので、`tailwind.config.js` に色を書いても反映されません。

- **外部 URL の画像や外部フォントが、`pnpm dev` では表示されるのにデプロイ後だけ表示されなかったら**、生成された CSP（1.0.6 では `img-src 'self' data:; font-src 'self' data:`）がモックのオリジン以外を許可していないためです。CSP は変えず、画像は `packages/website/public/` に置き、フォントはローカルのものに置き換えます。

### バージョンを上げたときの確認項目

- **生成された CSP の `connect-src` が Tracker の API（https）を許可しているか**を確認します。1.0.6 の既定値は `connect-src 'self' https: wss:` で、Tracker への送信はこれに依存しています。`pnpm nx run-many -t build` のあと、`dist/packages/infra/cdk.out` の Application スタックのテンプレートで `ContentSecurityPolicy` の値を見ます。`connect-src` が絞られていたら、公開 props で Tracker の API のオリジンを許可します。公開 props で設定できない場合は、生成コードを書き換えずに作業を止め、ユーザーに伝えます。
- **生成された CSP の `img-src` と `font-src` が `'self'` を含むか**を確認します。`public/` に置いた画像とローカルのフォントは、これに依存しています。外部オリジンが許可されるように変わっていても、外部の画像やフォントを使わない方針は変えません（`pnpm dev` と本番で見え方が変わらないようにするため）。上の既知の問題の CSP の値も書き直します。
- **生成された CSP の `script-src` が `'self'` を含むか**を確認します。Tracker の SDK はモックと同じオリジンから配信しているため、`'self'` が許可されていれば変更は不要です。
- **`--stageConfig` で生成された `main.ts` が `resolveStage('packages/infra', 'product-infra-sandbox')` で `stages.config.ts` の `region` を読む形か、`deploy-sandbox` / `destroy-sandbox` が `stages.config.ts` のプロファイルを使うスクリプト経由か、`bootstrap` がプロファイルを使わないままか、生成直後の `ApplicationStack` が空か**を確認します（手順 5・6・9 はこの形を前提にしています）。形が変わっていたら、手順 5・6・9 を新しい形に合わせて直します。
- **`Website` の公開 props に `encryptionKey` がまだあるか**を確認します（手順 6）。無くなっていたら、KMS キーを削除可能にする別の公開 props を探し、見つからなければユーザーに伝えます。
