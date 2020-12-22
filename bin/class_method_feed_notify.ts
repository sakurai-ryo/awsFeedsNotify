#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ClassMethodFeedNotifyStack } from '../lib/class_method_feed_notify-stack';

const app = new cdk.App();
new ClassMethodFeedNotifyStack(app, 'ClassMethodFeedNotifyStack');
