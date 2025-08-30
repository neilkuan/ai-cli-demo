#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { OpsCodeStack } from '../lib/gemini-cli-stack';

const app = new cdk.App();
new OpsCodeStack(app, 'GeminiCliStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'ap-east-2' },
});