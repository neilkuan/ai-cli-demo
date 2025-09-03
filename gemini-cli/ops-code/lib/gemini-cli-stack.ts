import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class OpsCodeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', {
      isDefault: true
    });
    const cluster = new ecs.Cluster(this, 'EcsCluster', {
      vpc,
      clusterName: 'gemini-cli-cluster',
      capacity: {
        instanceType: new ec2.InstanceType('t4g.medium'),
        minCapacity: 1,
        maxCapacity: 3,
        machineImage: ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.ARM) ,
      },
    });

    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef', {
        family: 'gemini-cli-task-def',
        networkMode: ecs.NetworkMode.AWS_VPC,
      });

      const logGroup = new logs.LogGroup(this, 'LogGroup', {
      logGroupName: 'gemini-cli-log-group',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
      taskDefinition.addContainer('AppContainer', {
        image: ecs.ContainerImage.fromRegistry('ghcr.io/neilkuan/ai-cli-demo:high-memory-server-v2'),
        memoryLimitMiB: 1024,
        cpu: 256,
        logging: new ecs.AwsLogDriver({
          streamPrefix: 'gemini-cli',
          logGroup,
        }),
      });

    new ecs.Ec2Service(this, 'Ec2Service', {
      serviceName: 'gemini-cli-service',
      cluster,
      taskDefinition,
    });

    const fn = new lambda.Function(this, 'Lambda', {
        functionName: 'gemini-cli-lambda',
        runtime: lambda.Runtime.PYTHON_3_13,
        handler: 'index.handler',
        timeout: cdk.Duration.seconds(10),
        logGroup: new logs.LogGroup(this, 'LambdaLog', { logGroupName: 'gemini-cli-lambda', removalPolicy: cdk.RemovalPolicy.DESTROY}),
        code: new lambda.InlineCode(`
import time

def handler(event, context):
    print('Start to sleep 4s...')
    time.sleep(4)
    print('Done')
`)
    })
    new cdk.CfnOutput(this, 'ClusterName', {
      value: cluster.clusterName
    });
    new cdk.CfnOutput(this, 'LambdaName', {
      value: fn.functionName
    });
  }
}
