import { Injectable, OnModuleInit, Logger, Inject } from "@nestjs/common";
import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { DYNAMO_DB_CLIENT } from "./dynamodb.provider";

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  @Inject(DYNAMO_DB_CLIENT)
  private readonly client: DynamoDBClient;
  private readonly logger = new Logger(DatabaseInitService.name);

  async onModuleInit() {
    try {
      this.logger.log("Checking for tables...");

      const result = await this.client.send(new ListTablesCommand());

      if (result.TableNames?.includes("Movies")) {
        this.logger.log("Movies table already exists.");
        return;
      }

      await this.client.send(
        new CreateTableCommand({
          TableName: "Movies",
          AttributeDefinitions: [
            { AttributeName: "id", AttributeType: "S" },
            { AttributeName: "entityType", AttributeType: "S" },
            { AttributeName: "rating", AttributeType: "N" },
          ],
          KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
          GlobalSecondaryIndexes: [
            {
              IndexName: "RatingIndex",
              KeySchema: [
                { AttributeName: "entityType", KeyType: "HASH" },
                { AttributeName: "rating", KeyType: "RANGE" },
              ],
              Projection: { ProjectionType: "ALL" },
              ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
              },
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        }),
      );
      this.logger.log("Movies table created successfully.");
    } catch (error: any) {
      this.logger.error("Failed to initialize DynamoDB table", error);
      throw error;
    }
  }
}
