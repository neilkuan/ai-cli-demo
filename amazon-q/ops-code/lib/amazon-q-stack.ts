import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as logs from 'aws-cdk-lib/aws-logs';

export class OpsCodeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', {
      isDefault: true
    });
    const cluster = new ecs.Cluster(this, 'EcsCluster', {
      vpc,
      clusterName: 'amazon-q-cluster',
      capacity: {
        instanceType: new ec2.InstanceType('t4g.medium'),
        minCapacity: 1,
        maxCapacity: 3,
      },
    });

    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef', {
        family: 'amazon-q-task-def',
        networkMode: ecs.NetworkMode.AWS_VPC,
      });
    const logGroup = new logs.LogGroup(this, 'LogGroup', {
      logGroupName: 'amazon-q-log-group',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    taskDefinition.addContainer('AppContainer', {
        image: ecs.ContainerImage.fromRegistry('ghcr.io/neilkuan/ai-cli-demo:high-memory-server-v1'),
        memoryLimitMiB: 512,
        cpu: 256,
        logging: new ecs.AwsLogDriver({
          streamPrefix: 'amazon-q',
          logGroup,
        }),
      });

    new ecs.Ec2Service(this, 'Ec2Service', {
      serviceName: 'amazon-q-service',
      cluster,
      taskDefinition,
    });

    new cdk.CfnOutput(this, 'ClusterName', {
      value: cluster.clusterName
    });
  }
}
