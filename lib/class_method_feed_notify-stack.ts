import * as cdk from "@aws-cdk/core";
import { Construct, Stack } from "@aws-cdk/core";
import * as codePipeline from "@aws-cdk/aws-codepipeline";
import { Pipeline } from "@aws-cdk/aws-codepipeline";
import * as actions from "@aws-cdk/aws-codepipeline-actions";
import * as codeBuild from "@aws-cdk/aws-codebuild";
import { LinuxBuildImage } from "@aws-cdk/aws-codebuild";
import * as iam from "@aws-cdk/aws-iam";

export async function classMethodFeedNotifyPipeline(
  scope: Construct,
  id: string
): Promise<Stack> {
  const stack = new cdk.Stack(scope, id, {
    stackName: "classMethodFeedNotifyPipeline",
  });
  const appOutput = new codePipeline.Artifact();
  const gitHubToken = cdk.SecretValue.secretsManager("classMethodFeedNotify");
  /**
   * GitHubからソースコードを取得
   */
  const sourceAction = new actions.GitHubSourceAction({
    actionName: "GitHubSourceAction",
    owner: "sakurai-ryo",
    oauthToken: gitHubToken,
    repo: "classMethodFeedNotify",
    branch: "master",
    output: appOutput,
    runOrder: 1,
  });
  /**
   * デプロイするための CodeBuildAction
   **/
  const deployRole = new iam.Role(
    stack,
    "ClassMethodFeedNotifyPipelineDeployRole",
    {
      assumedBy: new iam.ServicePrincipal("codebuild.amazonaws.com"),
      managedPolicies: [
        {
          managedPolicyArn: "arn:aws:iam::aws:policy/AdministratorAccess", // TODO: AssumeRoleを使う
        },
      ],
    }
  );
  const applicationBuild = new codeBuild.PipelineProject(
    stack,
    "ClassMethodFeedNotifyPipeline",
    {
      projectName: "ClassMethodFeedNotifyPipeline",
      buildSpec: codeBuild.BuildSpec.fromSourceFilename(
        "./buildspec/buildspec-deploy.yml"
      ),
      role: deployRole,
      environment: {
        buildImage: LinuxBuildImage.STANDARD_3_0,
        environmentVariables: {
          AWS_DEFAULT_REGION: {
            type: codeBuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: stack.region,
          },
        },
      },
    }
  );
  const applicationDeployAction = new actions.CodeBuildAction({
    actionName: "ClassMethodFeedNotifyDeployPipeline",
    project: applicationBuild,
    input: appOutput,
    runOrder: 3,
  });
  /**
   * Pipeline を定義し、あらかじめ作っておいたアクションを任意のステージに設置する
   **/
  const pipeline = new Pipeline(stack, "ClassMethodFeedNotifyPipeline", {
    pipelineName: "ClassMethodFeedNotifyPipeline",
  });
  pipeline.addStage({
    stageName: "GitHubSourceAction-stage",
    actions: [sourceAction],
  });
  pipeline.addStage({
    stageName: "ClassMethodFeedNotifyDeploy-stage",
    actions: [applicationDeployAction],
  });
  return stack;
}
export async function classMethodFeedNotify(
  scope: Construct,
  id: string
): Promise<Stack> {
  const stack = new cdk.Stack(scope, id, {
    stackName: "classMethodFeedNotifyPipeline",
  });
  return stack;
}
