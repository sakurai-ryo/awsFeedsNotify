#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { ClassMethodFeedNotifyPipeline } from "../lib/classMethodFeedNotifyLPipelineStack";

const app = new cdk.App();

new ClassMethodFeedNotifyPipeline(app, "classMethodFeedNotifyPipeline");
