#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { classMethodFeedNotifyPipeline } from "../lib/class_method_feed_notify-stack";

const app = new cdk.App();

async function buildApp(): Promise<void> {
  const app = new cdk.App();
  await classMethodFeedNotifyPipeline(app, "ClassMethodFeedNotifyStack");
}

buildApp();
