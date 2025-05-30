import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import {
  QueryCommand,
  PutCommand,
  ScanCommand,
  GetCommand,
  UpdateCommand,
  DynamoDBDocumentClient,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

import { DYNAMO_DB_DOC_CLIENT } from "../database/dynamodb.provider";

import { NanoId } from "../utils/id.generator";

import { CreateMovieInput } from "./dto/create-movie.input";
import { UpdateMovieInput } from "./dto/update-movie.input";
import { FindHighestRatedMovies } from "./dto/find-highest-rated-movies.input";

@Injectable()
export class MoviesService {
  @Inject(DYNAMO_DB_DOC_CLIENT)
  private readonly docClient: DynamoDBDocumentClient;

  async findAll() {
    const result = await this.docClient.send(new ScanCommand({ TableName: "Movies" }));

    return result.Items?.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt as string),
      updatedAt: new Date(item.updatedAt as string),
    }));
  }

  async findOne(id: string) {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: "Movies",
        Key: { id },
      }),
    );

    if (!result.Item) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return {
      ...result.Item,
      createdAt: new Date(result.Item.createdAt as string),
      updatedAt: new Date(result.Item.updatedAt as string),
    };
  }

  async findHighestRatedMovies({ quantity, minRating }: FindHighestRatedMovies) {
    const result = await this.docClient.send(
      new QueryCommand({
        TableName: "Movies",
        IndexName: "RatingIndex",
        KeyConditionExpression: "#pk = :pk AND #rating >= :minRating",
        ExpressionAttributeNames: {
          "#pk": "entityType",
          "#rating": "rating",
        },
        ExpressionAttributeValues: {
          ":pk": "MOVIE",
          ":minRating": minRating,
        },
        ScanIndexForward: false,
        Limit: quantity,
      }),
    );

    return result.Items?.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt as string),
      updatedAt: new Date(item.updatedAt as string),
    }));
  }

  async create(createMovieInput: CreateMovieInput) {
    const now = new Date();
    const id = NanoId.generate();

    await this.docClient.send(
      new PutCommand({
        TableName: "Movies",
        Item: {
          ...createMovieInput,
          id,
          entityType: "MOVIE",
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      }),
    );

    return {
      ...createMovieInput,
      id,
      entityType: "MOVIE",
      createdAt: now,
      updatedAt: now,
    };
  }

  async update(updateMovieInput: UpdateMovieInput) {
    await this.findOne(updateMovieInput.id);

    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, string | number> = {};

    if (updateMovieInput.title !== undefined) {
      updateExpressions.push("#title = :title");
      expressionAttributeNames["#title"] = "title";
      expressionAttributeValues[":title"] = updateMovieInput.title;
    }

    if (updateMovieInput.director !== undefined) {
      updateExpressions.push("#director = :director");
      expressionAttributeNames["#director"] = "director";
      expressionAttributeValues[":director"] = updateMovieInput.director;
    }

    if (updateMovieInput.rating !== undefined) {
      updateExpressions.push("#rating = :rating");
      expressionAttributeNames["#rating"] = "rating";
      expressionAttributeValues[":rating"] = updateMovieInput.rating;
    }

    updateExpressions.push("#updatedAt = :updatedAt");
    expressionAttributeNames["#updatedAt"] = "updatedAt";
    expressionAttributeValues[":updatedAt"] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: "Movies",
      Key: { id: updateMovieInput.id },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await this.docClient.send(command);
    if (!result.Attributes) {
      throw new NotFoundException(`Movie with ID ${updateMovieInput.id} not found`);
    }

    return {
      ...result.Attributes,
      createdAt: new Date(result.Attributes.createdAt as string),
      updatedAt: new Date(result.Attributes.updatedAt as string),
    };
  }

  async delete(id: string) {
    const movie = await this.findOne(id);

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    await this.docClient.send(
      new DeleteCommand({
        TableName: "Movies",
        Key: { id },
      }),
    );

    return true;
  }
}
