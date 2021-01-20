import * as cdk from "@aws-cdk/core";
import * as ecs from "@aws-cdk/aws-ecs";
// import * as ecr from "@aws-cdk/aws-ecr";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";

// TODO: リソース名などの変更
// TODO: ECRの利用
// TODO: ドキュメント読んでから気づいたけどローバラはいらなくて、定期実行にしないと
export class ClassMethodFeedNotifyPipeline extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, "Vpc", {});

    // ECSクラスター
    const cluster = new ecs.Cluster(this, "Cluster", {
      vpc,
    });

    const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      "Service",
      {
        cluster,
        memoryLimitMiB: 1024,
        cpu: 512,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        },
      }
    );

    loadBalancedFargateService.targetGroup.configureHealthCheck({
      path: "/custom-health-path",
    });
  }
}
