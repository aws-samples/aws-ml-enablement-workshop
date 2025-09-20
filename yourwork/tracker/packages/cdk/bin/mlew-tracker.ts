#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MLEWTrackerStack } from '../lib/mlew-tracker-stack';

const app = new cdk.App();

// 環境ごとにスタックを作成
const environment = app.node.tryGetContext('environment') || 'dev';

new MLEWTrackerStack(app, `MLEWTrackerStack-${environment}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-west-2',
  },
  environment,
});