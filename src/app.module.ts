import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { MoviesModule } from "./movies/movies.module";
import { DatabaseInitService } from "./database/create-tables.service";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
    }),
    MoviesModule,
    DatabaseModule,
  ],
  providers: [DatabaseInitService],
})
export class AppModule {}
