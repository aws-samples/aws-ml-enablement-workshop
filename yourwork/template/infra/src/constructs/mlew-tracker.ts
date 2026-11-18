// MLEW Tracker のインフラ（固定ファイル）。CloudWatch RUM の app monitor を作る。
// yourwork/template/infra/src/constructs/mlew-tracker.ts からそのままコピーして使う。編集しない。
import { RuntimeConfig } from '@product/common-constructs';
import { Aws, CfnOutput, Stack } from 'aws-cdk-lib';
import type { IDistribution } from 'aws-cdk-lib/aws-cloudfront';
import { CfnAppMonitor } from 'aws-cdk-lib/aws-rum';
import { Construct } from 'constructs';

export interface MlewTrackerProps {
  // 計測するモックの CloudFront ディストリビューション（Website の cloudFrontDistribution）
  readonly distribution: IDistribution;
}

// ページビューとクリックを CloudWatch RUM で受け取り、CloudWatch Logs に保存する。
// app monitor の ID とリージョンは runtime-config.json でブラウザに渡す（mlewTracker.ts が読む）
export class MlewTracker extends Construct {
  public readonly appMonitor: CfnAppMonitor;

  constructor(scope: Construct, id: string, props: MlewTrackerProps) {
    super(scope, id);

    const name = `${Stack.of(this).stackName}-tracker`;
    this.appMonitor = new CfnAppMonitor(this, 'AppMonitor', {
      name,
      // モックの URL と、pnpm dev（load-runtime-config 後）のローカル確認だけから受け付ける
      domainList: [props.distribution.distributionDomainName, 'localhost'],
      // ログは CloudWatch Logs（/aws/vendedlogs/RUMService_<name><ID の先頭 8 文字>）に保存される。
      // ロググループは RUM が作り、保持期間は 30 日。スタックを削除しても残る
      cwLogEnabled: true,
      customEvents: { status: 'ENABLED' },
      appMonitorConfiguration: {
        allowCookies: true,
        enableXRay: false,
        sessionSampleRate: 1,
        telemetries: [],
      },
      // ブラウザは認証情報を持たないので、署名なしの送信を許可する
      resourcePolicy: {
        policyDocument: Stack.of(this).toJsonString({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: '*',
              Action: 'rum:PutRumEvents',
              Resource: `arn:${Aws.PARTITION}:rum:${Aws.REGION}:${Aws.ACCOUNT_ID}:appmonitor/${name}`,
            },
          ],
        }),
      },
    });

    RuntimeConfig.ensure(this).set('connection', 'mlewTracker', {
      appMonitorId: this.appMonitor.attrId,
      region: Aws.REGION,
    });

    new CfnOutput(this, 'AppMonitorName', { value: name });
    new CfnOutput(this, 'AppMonitorId', { value: this.appMonitor.attrId });
  }
}
