/* eslint-disable max-len */
import { Injectable, Inject, NotFoundException, BadRequestException } from "@nestjs/common";
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
import { ComplexFilterInput } from "./dto/complex-filter.input";

@Injectable()
export class MoviesService {
  @Inject(DYNAMO_DB_DOC_CLIENT)
  private readonly docClient: DynamoDBDocumentClient;

  async findAll() {
    const result = await this.docClient.send(new ScanCommand({ TableName: "Movies" }));

    return result.Items?.map((item) => ({
      ...item,
      releaseDate: item.releaseDate ? new Date(item.releaseDate as string) : null,
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
      releaseDate: result.Item.releaseDate ? new Date(result.Item.releaseDate as string) : null,
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
      releaseDate: item.releaseDate ? new Date(item.releaseDate as string) : null,
      createdAt: new Date(item.createdAt as string),
      updatedAt: new Date(item.updatedAt as string),
    }));
  }

  async create(createMovieInput: CreateMovieInput) {
    const now = new Date();
    const releaseDate = new Date(createMovieInput.releaseDate);
    const id = NanoId.generate();

    await this.docClient.send(
      new PutCommand({
        TableName: "Movies",
        Item: {
          ...createMovieInput,
          id,
          entityType: "MOVIE",
          releaseDate: releaseDate.toISOString(),
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      }),
    );

    return {
      ...createMovieInput,
      id,
      entityType: "MOVIE",
      releaseDate,
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

  private buildComplexFilterExpression({ genre, minRating, maxRating, minYear, maxYear }: ComplexFilterInput) {
    if (!genre && !minRating && !maxRating && !minYear && !maxYear) {
      throw new BadRequestException("At least one filter attribute must be provided");
    }

    const firstDate = minYear ? new Date(minYear, 0, 1).toISOString() : null;
    const lastDate = maxYear ? new Date(maxYear, 11, 31).toISOString() : null;

    let filterExpression = "attribute_exists(#id)";
    const expressionAttributeNames: Record<string, string> = { "#id": "id" };
    const expressionAttributeValues: Record<string, any> = {};

    if (genre) {
      filterExpression += " AND #genre = :genre";
      expressionAttributeNames["#genre"] = "genre";
      expressionAttributeValues[":genre"] = genre;
    }

    if (minRating) {
      filterExpression += " AND #rating >= :minRating";
      expressionAttributeNames["#rating"] = "rating";
      expressionAttributeValues[":minRating"] = minRating;
    }

    if (maxRating) {
      filterExpression += " AND #rating <= :maxRating";
      expressionAttributeNames["#rating"] = "rating";
      expressionAttributeValues[":maxRating"] = maxRating;
    }

    if (minYear) {
      filterExpression += " AND #releaseDate >= :minDate";
      expressionAttributeNames["#releaseDate"] = "releaseDate";
      expressionAttributeValues[":minDate"] = firstDate;
    }

    if (maxYear) {
      filterExpression += " AND #releaseDate <= :maxDate";
      expressionAttributeNames["#releaseDate"] = "releaseDate";
      expressionAttributeValues[":maxDate"] = lastDate;
    }

    return {
      filterExpression,
      expressionAttributeNames,
      expressionAttributeValues,
    };
  }

  async findByComplexFilter(filterInput: ComplexFilterInput) {
    const { filterExpression, expressionAttributeNames, expressionAttributeValues } =
      this.buildComplexFilterExpression(filterInput);

    const result = await this.docClient.send(
      new ScanCommand({
        TableName: "Movies",
        FilterExpression: filterExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      }),
    );

    return result.Items?.map((item) => ({
      ...item,
      releaseDate: item.releaseDate ? new Date(item.releaseDate as string) : null,
      createdAt: new Date(item.createdAt as string),
      updatedAt: new Date(item.updatedAt as string),
    }));
  }
}
