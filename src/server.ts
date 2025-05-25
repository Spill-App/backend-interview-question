import 'reflect-metadata';
import 'dotenv/config';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSchema } from 'type-graphql';
import { MoviesResolver } from './resolvers/movie.resolver';
import path from 'node:path';

async function bootstrap() {
    const schema = await buildSchema({
        resolvers: [MoviesResolver],
        emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
    });

    const server = new ApolloServer({
        schema,
    });

    const { url } = await startStandaloneServer(server);
    console.log(`🚀 Server ready at ${url}`);
}

bootstrap();
