import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle,
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as ClassMethodFeedNotify from "../lib/classMethodFeedNotifyLPipelineStack";

test("Empty Stack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new ClassMethodFeedNotify.ClassMethodFeedNotifyStack(
    app,
    "MyTestStack"
  );
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {},
      },
      MatchStyle.EXACT
    )
  );
});
