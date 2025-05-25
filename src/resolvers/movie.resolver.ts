import { Arg, Mutation, Query, Resolver, Root } from 'type-graphql';
import { MovieInput } from '../dtos/inputs/movie.input';
import { MovieModel } from '../dtos/models/movie.model';
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import ddb from '../dynamodb';

const TABLE_NAME = process.env.TABLE_NAME;

@Resolver(() => MovieModel)
export class MoviesResolver {
    @Query(() => [MovieModel])
    async popularMovies(limit = 10) {
        // Could use a GSI here to order a specific column
        // The scan is used to fetch all data ignoring indexes, the query method uses indexes and could be used with a GSI
        const result = await ddb.send(
            new ScanCommand({
                TableName: TABLE_NAME,
            })
        );

        return result.Items?.sort((a, b) => b.rating - a.rating).slice(0, limit);
    }

    @Query(() => MovieModel, { nullable: true })
    async findMovie(@Arg('id') id: string) {
        const result = await ddb.send(
            new GetCommand({
                TableName: TABLE_NAME,
                Key: { id },
            })
        );

        return result.Item;
    }

    @Mutation(() => MovieModel)
    async createMovie(@Arg('movie') movie: MovieInput) {
        const item = { id: crypto.randomUUID(), ...movie };
        await ddb.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: item,
            })
        );

        return item;
    }

    @Mutation(() => MovieModel)
    async updateMovie(@Arg('id') id: string, @Arg('movie') movie: MovieInput) {
        const updateExp: string[] = [];
        const expAttrVals: Record<string, any> = {};
        const expAttrNames: Record<string, string> = {};

        for (const [key, value] of Object.entries(movie)) {
            updateExp.push(`#${key} = :${key}`);
            expAttrVals[`:${key}`] = value;
            expAttrNames[`#${key}`] = key;
        }

        const result = await ddb.send(
            new UpdateCommand({
                TableName: TABLE_NAME,
                Key: { id },
                UpdateExpression: `SET ${updateExp.join(', ')}`,
                ExpressionAttributeValues: expAttrVals,
                ExpressionAttributeNames: expAttrNames,
                ReturnValues: 'ALL_NEW',
            })
        );

        return result.Attributes;
    }

    @Mutation(() => String)
    async deleteMovie(@Arg('id') id: string) {
        await ddb.send(
            new DeleteCommand({
                TableName: TABLE_NAME,
                Key: { id },
            })
        );

        return id;
    }
}
