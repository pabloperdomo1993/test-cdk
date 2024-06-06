import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queueUserDistribute = new sqs.Queue(this, 'user_distribute', {
      visibilityTimeout: cdk.Duration.seconds(300),
      queueName: 'user_distribute'
    });

    const queueUserUpdate = new sqs.Queue(this, 'user_update', {
      visibilityTimeout: cdk.Duration.seconds(300),
      queueName: 'user_update'
    });

    const queueUserSave = new sqs.Queue(this, 'user_save', {
      visibilityTimeout: cdk.Duration.seconds(300),
      queueName: 'user_save'
    });

    const lambdaUserUpdate = lambda.Function.fromFunctionArn(
      this,
      'back-end-dev-userUpdate',
      'arn:aws:lambda:us-east-2:943766074476:function:back-end-dev-userUpdate'
    );

    const lambdaUserSave = lambda.Function.fromFunctionArn(
      this,
      'back-end-dev-userSave',
      'arn:aws:lambda:us-east-2:943766074476:function:back-end-dev-userSave'
    );

    const lambdaUserDistribute = lambda.Function.fromFunctionArn(
      this,
      'back-end-dev-distributeData',
      'arn:aws:lambda:us-east-2:943766074476:function:back-end-dev-distributeData'
    );

    lambdaUserDistribute.addEventSource(new lambdaEventSources.SqsEventSource(queueUserDistribute));

    lambdaUserUpdate.addEventSource(new lambdaEventSources.SqsEventSource(queueUserUpdate));
    
    lambdaUserSave.addEventSource(new lambdaEventSources.SqsEventSource(queueUserSave));
  }
}
