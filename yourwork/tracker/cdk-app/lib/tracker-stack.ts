import * as path from 'path';
import { Duration, RemovalPolicy, Stack, StackProps, Tags, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

export interface TrackerStackProps extends StackProps {
  environmentName: string;
  eventTtlDays: number;
  apiThrottleBurstLimit: number;
  apiThrottleRateLimit: number;
}

export class TrackerStack extends Stack {
  constructor(scope: Construct, id: string, props: TrackerStackProps) {
    super(scope, id, props);
    const accountId = Stack.of(this).account;

    const isProd = props.environmentName === 'prod';
    const persistentResourcePolicy = isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY;

    const tagResource = (resource: Construct, component: string) => {
      Tags.of(resource).add('Environment', props.environmentName);
      Tags.of(resource).add('Project', 'MLEWTracker');
      Tags.of(resource).add('Component', component);
    };

    Tags.of(this).add('Environment', props.environmentName);
    Tags.of(this).add('Project', 'MLEWTracker');

    // DynamoDB Tables
    const eventsTable = new dynamodb.Table(this, 'EventsTable', {
      tableName: `mlew-events-${props.environmentName}`,
      partitionKey: { name: 'applicationId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestampEventId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'ttl',
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: persistentResourcePolicy,
    });
    eventsTable.addGlobalSecondaryIndex({
      indexName: 'UserIndex',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestampEventId', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });
    eventsTable.addGlobalSecondaryIndex({
      indexName: 'DateIndex',
      partitionKey: { name: 'applicationId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'date', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });
    tagResource(eventsTable, 'Database');

    const aggregationsTable = new dynamodb.Table(this, 'AggregationsTable', {
      tableName: `mlew-aggregations-${props.environmentName}`,
      partitionKey: { name: 'applicationIdPeriod', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: persistentResourcePolicy,
    });
    tagResource(aggregationsTable, 'Database');

    const applicationsTable = new dynamodb.Table(this, 'ApplicationsTable', {
      tableName: `mlew-applications-${props.environmentName}`,
      partitionKey: { name: 'applicationId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: persistentResourcePolicy,
    });
    tagResource(applicationsTable, 'Database');

    // S3 Buckets
    const dashboardBucket = new s3.Bucket(this, 'DashboardBucket', {
      bucketName: `mlew-dashboard-${accountId}`,
      versioned: isProd,
      autoDeleteObjects: !isProd,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,
      removalPolicy: persistentResourcePolicy,
    });
    tagResource(dashboardBucket, 'Storage');

    const sdkBucket = new s3.Bucket(this, 'SdkBucket', {
      bucketName: `mlew-sdk-${accountId}`,
      versioned: isProd,
      autoDeleteObjects: !isProd,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,
      removalPolicy: persistentResourcePolicy,
    });
    tagResource(sdkBucket, 'Storage');


    // CloudFront Distributions
    const dashboardOAC = new cloudfront.OriginAccessControl(this, 'DashboardOAC', {
      originAccessControlName: `mlew-dashboard-oac-${accountId}`,
      description: 'OAC for Dashboard S3 bucket',
      originAccessControlOriginType: cloudfront.OriginAccessControlOriginType.S3,
      signing: cloudfront.Signing.SIGV4_ALWAYS,
    });

    const dashboardDistribution = new cloudfront.Distribution(this, 'DashboardDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(dashboardBucket, {
          originAccessControl: dashboardOAC,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.minutes(5),
        },
      ],
    });

    const sdkOAC = new cloudfront.OriginAccessControl(this, 'SdkOAC', {
      originAccessControlName: `mlew-sdk-oac-${accountId}`,
      description: 'OAC for SDK S3 bucket',
      originAccessControlOriginType: cloudfront.OriginAccessControlOriginType.S3,
      signing: cloudfront.Signing.SIGV4_ALWAYS,
    });

    const sdkDistribution = new cloudfront.Distribution(this, 'SdkDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(sdkBucket, {
          originAccessControl: sdkOAC,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
    });

    tagResource(dashboardDistribution, 'Delivery');
    tagResource(sdkDistribution, 'Delivery');

    // Grant CloudFront OAC access to S3 buckets
    dashboardBucket.addToResourcePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
      actions: ['s3:GetObject'],
      resources: [dashboardBucket.arnForObjects('*')],
      conditions: {
        StringEquals: {
          'AWS:SourceArn': `arn:aws:cloudfront::${accountId}:distribution/${dashboardDistribution.distributionId}`,
        },
      },
    }));

    sdkBucket.addToResourcePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
      actions: ['s3:GetObject'],
      resources: [sdkBucket.arnForObjects('*')],
      conditions: {
        StringEquals: {
          'AWS:SourceArn': `arn:aws:cloudfront::${accountId}:distribution/${sdkDistribution.distributionId}`,
        },
      },
    }));

    // Lambda functions
    const bundling: lambdaNodejs.BundlingOptions = {
      externalModules: ['aws-sdk'],
      target: 'es2022',
      format: lambdaNodejs.OutputFormat.CJS,
      minify: true,
      sourcesContent: false,
    };

    const eventIngestionFunction = new lambdaNodejs.NodejsFunction(this, 'EventIngestionFunction', {
      functionName: `mleww3-event-ingestion-${props.environmentName}`,
      entry: path.join(__dirname, '..', '..', 'packages', 'lambdas', 'event-ingestion', 'src', 'index.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      memorySize: 256,
      timeout: Duration.seconds(30),
      bundling,
      environment: {
        ENVIRONMENT: props.environmentName,
        EVENTS_TABLE: eventsTable.tableName,
        APPLICATIONS_TABLE: applicationsTable.tableName,
        EVENT_TTL_DAYS: props.eventTtlDays.toString(),
      },
    });
    tagResource(eventIngestionFunction, 'Compute');

    const queryFunction = new lambdaNodejs.NodejsFunction(this, 'QueryFunction', {
      functionName: `mleww3-query-${props.environmentName}`,
      entry: path.join(__dirname, '..', '..', 'packages', 'lambdas', 'query', 'src', 'index.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      memorySize: 512,
      timeout: Duration.seconds(30),
      bundling,
      environment: {
        ENVIRONMENT: props.environmentName,
        EVENTS_TABLE: eventsTable.tableName,
        AGGREGATIONS_TABLE: aggregationsTable.tableName,
        APPLICATIONS_TABLE: applicationsTable.tableName,
      },
    });
    tagResource(queryFunction, 'Compute');

    const streamAggregationFunction = new lambdaNodejs.NodejsFunction(this, 'StreamAggregationFunction', {
      functionName: `mleww3-stream-aggregation-${props.environmentName}`,
      entry: path.join(
        __dirname,
        '..',
        '..',
        'packages',
        'lambdas',
        'stream-aggregation',
        'src',
        'index.ts'
      ),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      memorySize: 128,
      timeout: Duration.seconds(60),
      bundling,
      environment: {
        ENVIRONMENT: props.environmentName,
        AGGREGATIONS_TABLE: aggregationsTable.tableName,
      },
    });
    tagResource(streamAggregationFunction, 'Compute');

    eventsTable.grantReadWriteData(eventIngestionFunction);
    eventsTable.grantReadData(queryFunction);
    eventsTable.grantStreamRead(streamAggregationFunction);

    aggregationsTable.grantReadWriteData(streamAggregationFunction);
    aggregationsTable.grantReadData(queryFunction);

    applicationsTable.grantReadWriteData(eventIngestionFunction);
    applicationsTable.grantReadData(queryFunction);

    // DynamoDB stream event source for aggregation
    streamAggregationFunction.addEventSource(
      new lambdaEventSources.DynamoEventSource(eventsTable, {
        startingPosition: lambda.StartingPosition.LATEST,
        batchSize: 25,
        maxBatchingWindow: Duration.seconds(5),
        retryAttempts: 3,
      })
    );

    // API Gateway
    const restApi = new apigw.RestApi(this, 'AnalyticsApi', {
      restApiName: `mleww3-analytics-api-${props.environmentName}`,
      description: 'MLEWW3 Tracker Analytics API',
      deployOptions: {
        stageName: props.environmentName,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowHeaders: ['Content-Type', 'X-Api-Key'],
        allowMethods: ['GET', 'OPTIONS'],
      },
      endpointConfiguration: {
        types: [apigw.EndpointType.REGIONAL],
      },
    });
    tagResource(restApi, 'API');

    const v1 = restApi.root.addResource('v1');
    const eventsResource = v1.addResource('events');
    const analyticsResource = v1.addResource('analytics');
    const applicationsResource = analyticsResource.addResource('applications');
    const appResource = analyticsResource.addResource('{appId}');
    const summaryResource = appResource.addResource('summary');
    const appEventsResource = appResource.addResource('events');

    const eventIngestionIntegration = new apigw.LambdaIntegration(eventIngestionFunction, {
      proxy: true,
    });
    const queryIntegration = new apigw.LambdaIntegration(queryFunction, {
      proxy: true,
    });

    eventsResource.addMethod('POST', eventIngestionIntegration, { apiKeyRequired: true });

    applicationsResource.addMethod('GET', queryIntegration, { apiKeyRequired: true });
    summaryResource.addMethod('GET', queryIntegration, { apiKeyRequired: true });
    appEventsResource.addMethod('GET', queryIntegration, { apiKeyRequired: true });

    const apiKey = restApi.addApiKey('ApiKey', {
      apiKeyName: `mleww3-api-key-${props.environmentName}`,
      description: 'API Key for MLEW Tracker',
    });

    const usagePlan = restApi.addUsagePlan('UsagePlan', {
      name: `mleww3-usage-plan-${props.environmentName}`,
      description: 'Usage plan for MLEW Tracker API',
      throttle: {
        burstLimit: props.apiThrottleBurstLimit,
        rateLimit: props.apiThrottleRateLimit,
      },
      quota: {
        limit: 1_000_000,
        period: apigw.Period.MONTH,
      },
    });
    usagePlan.addApiKey(apiKey);
    usagePlan.addApiStage({
      api: restApi,
      stage: restApi.deploymentStage,
    });

    // Outputs
    const apiBaseUrl = restApi.url.endsWith('/') ? restApi.url.slice(0, -1) : restApi.url;

    new CfnOutput(this, 'ApiEndpoint', {
      description: 'Analytics API Base URL',
      value: apiBaseUrl,
      exportName: `${Stack.of(this).stackName}-ApiEndpoint`,
    });

    new CfnOutput(this, 'ApiKeyId', {
      description: 'API Key ID',
      value: apiKey.keyId,
      exportName: `${Stack.of(this).stackName}-ApiKeyId`,
    });

    new CfnOutput(this, 'DashboardURL', {
      description: 'Dashboard CloudFront URL',
      value: dashboardDistribution.distributionDomainName,
      exportName: `${Stack.of(this).stackName}-DashboardURL`,
    });

    new CfnOutput(this, 'DashboardBucketName', {
      description: 'Dashboard S3 Bucket Name',
      value: dashboardBucket.bucketName,
      exportName: `${Stack.of(this).stackName}-DashboardBucket`,
    });

    new CfnOutput(this, 'SdkBucketName', {
      description: 'Tracker SDK S3 Bucket Name',
      value: sdkBucket.bucketName,
      exportName: `${Stack.of(this).stackName}-SdkBucket`,
    });

    new CfnOutput(this, 'SdkDistributionDomain', {
      description: 'Tracker SDK CloudFront URL',
      value: sdkDistribution.distributionDomainName,
      exportName: `${Stack.of(this).stackName}-SdkDistributionDomain`,
    });

    new CfnOutput(this, 'EventsTableName', {
      description: 'Events DynamoDB Table Name',
      value: eventsTable.tableName,
      exportName: `${Stack.of(this).stackName}-EventsTable`,
    });

  }
}
