import { Module } from "@nestjs/common";
import { dynamoDbProviders } from "./dynamodb.provider";

@Module({
  providers: [...dynamoDbProviders],
  exports: [...dynamoDbProviders],
})
export class DatabaseModule {}
