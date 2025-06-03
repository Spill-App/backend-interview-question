import { Provider } from "@nestjs/common";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const DYNAMO_DB_CLIENT = "DYNAMO_DB_CLIENT";
export const DYNAMO_DB_DOC_CLIENT = "DYNAMO_DB_DOC_CLIENT";

export const dynamoDbProviders: Provider[] = [
  {
    provide: DYNAMO_DB_CLIENT,
    useFactory: () =>
      new DynamoDBClient({
        region: "local",
        endpoint: "http://localhost:8000",
        accountId: "dummy",
        credentials: {
          sessionToken: "dummy",
          accessKeyId: "dummy",
          secretAccessKey: "dummy",
        },
      }),
  },
  {
    provide: DYNAMO_DB_DOC_CLIENT,
    useFactory: (client: DynamoDBClient) => DynamoDBDocumentClient.from(client),
    inject: [DYNAMO_DB_CLIENT],
  },
];
