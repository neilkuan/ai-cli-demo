#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { OpsCodeStack } from '../lib/claude-code-stack';

const app = new cdk.App();
new OpsCodeStack(app, 'OpsCodeStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'ap-east-2' }
});