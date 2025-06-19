import AWS from '../utils/aws';

export const TABLE_NAME = 'Movies';

export function getDocumentClient(): AWS.DynamoDB.DocumentClient {
  return new AWS.DynamoDB.DocumentClient();
}

export async function ensureMoviesTable(): Promise<boolean> {
  const dynamodb = new AWS.DynamoDB();
  const params: AWS.DynamoDB.CreateTableInput = {
    TableName: TABLE_NAME,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };
  try {
    await dynamodb.createTable(params).promise();
    return true;
  } catch (err: any) {
    if (err.code === 'ResourceInUseException') return false;
    throw err;
  }
} 