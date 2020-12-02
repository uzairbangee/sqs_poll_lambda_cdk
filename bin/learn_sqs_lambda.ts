#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LearnSqsLambdaStack } from '../lib/learn_sqs_lambda-stack';

const app = new cdk.App();
new LearnSqsLambdaStack(app, 'LearnSqsLambdaStack');
