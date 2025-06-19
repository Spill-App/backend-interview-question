import AWS from 'aws-sdk';

AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
} as any);
AWS.config.credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'fakeMyKeyId',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'fakeSecretAccessKey',
};

export default AWS;