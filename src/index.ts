import { ApolloServer } from 'apollo-server';
import { typeDefs, resolvers } from './app/graphql';
import { ensureMoviesTable } from './db';

async function startServer(): Promise<void> {
  await ensureMoviesTable();
  const server = new ApolloServer({ typeDefs, resolvers });
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}

startServer(); 