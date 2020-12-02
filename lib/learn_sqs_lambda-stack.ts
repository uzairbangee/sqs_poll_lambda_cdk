import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as event_source from '@aws-cdk/aws-lambda-event-sources';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as sqs from '@aws-cdk/aws-sqs';

export class LearnSqsLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const queue = new sqs.Queue(this, 'queue', {
      queueName: 'queue'
    });

    const table = new ddb.Table(this, 'table', {
      partitionKey: { name: 'id', type: ddb.AttributeType.STRING }
    });

    const publishFunction = new lambda.Function(this, 'publishFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/publish'),
      environment: {
        QUEUE_URL: queue.queueUrl
      },
    });

    const api = new apigateway.RestApi(this, 'api', {
      deployOptions: {
        stageName: 'dev'
      },
      defaultIntegration : new apigateway.LambdaIntegration(publishFunction),
    });

    api.root.addMethod("POST");

    new cdk.CfnOutput(this, "OutputURL", {
      value: api.url
    })

    const subscribeFunction = new lambda.Function(this, 'subscribeFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/subscribe'),
      environment: {
        QUEUE_URL: queue.queueUrl,
        TABLE_NAME: table.tableName
      },
    });

    subscribeFunction.addEventSource(new event_source.SqsEventSource(queue));

    queue.grantSendMessages(publishFunction);
    table.grantFullAccess(subscribeFunction);

  }
}
