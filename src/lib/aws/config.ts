import dotenv from 'dotenv';
import { fromEnv } from '@aws-sdk/credential-providers';

dotenv.config();

export const awsConfig = {
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
  apiVersion: '2015-03-31',
};

export const apiGatewayConfig = {
  endpoint: process.env.AWS_API_GATEWAY_ENDPOINT,
  stage: process.env.AWS_API_GATEWAY_STAGE,
};
