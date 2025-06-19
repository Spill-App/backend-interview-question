import { ApolloServer } from 'apollo-server';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import { ensureMoviesTable, getDocumentClient, TABLE_NAME } from '../../db';

describe('GraphQL Resolvers', () => {
  let server: ApolloServer;

  beforeAll(async () => {
    await ensureMoviesTable();
    server = new ApolloServer({ typeDefs, resolvers });
  });

  beforeEach(async () => {
    // Clean up the table before each test
    const docClient = getDocumentClient();
    const scan = await docClient.scan({ TableName: TABLE_NAME }).promise();
    if (scan.Items && scan.Items.length > 0) {
      await Promise.all(
        scan.Items.map(item =>
          docClient.delete({ TableName: TABLE_NAME, Key: { id: item.id } }).promise()
        )
      );
    }
  });

  it('should create and fetch a movie', async () => {
    const CREATE = `
      mutation CreateMovie($input: MovieInput!) {
        createMovie(input: $input) { id title description releaseDate popularity }
      }
    `;
    const input = {
      title: 'Apollo Test',
      description: 'Apollo test movie',
      releaseDate: '2022-01-01',
      popularity: 8.8,
    };
    const res = await server.executeOperation({
      query: CREATE,
      variables: { input },
    });
    expect(res.errors).toBeUndefined();
    const movie = res.data?.createMovie;
    expect(movie).toMatchObject(input);
    expect(movie.id).toBeDefined();

    const GET = `
      query Movie($id: ID!) {
        movie(id: $id) { id title description releaseDate popularity }
      }
    `;
    const getRes = await server.executeOperation({
      query: GET,
      variables: { id: movie.id },
    });
    expect(getRes.errors).toBeUndefined();
    expect(getRes.data?.movie).toEqual(movie);
  });

  it('should list popular movies', async () => {
    const CREATE = `
      mutation CreateMovie($input: MovieInput!) {
        createMovie(input: $input) { id }
      }
    `;
    const movies = [
      { title: 'A', popularity: 1 },
      { title: 'B', popularity: 5 },
      { title: 'C', popularity: 3 },
    ];
    for (const m of movies) {
      await server.executeOperation({ query: CREATE, variables: { input: m } });
    }
    const POPULAR = `
      query PopularMovies($limit: Int!) {
        popularMovies(limit: $limit) { title popularity }
      }
    `;
    const res = await server.executeOperation({ query: POPULAR, variables: { limit: 3 } });
    expect(res.errors).toBeUndefined();
    expect(res.data?.popularMovies.length).toBe(3);
    expect(res.data?.popularMovies[0].popularity).toBe(5);
    expect(res.data?.popularMovies[1].popularity).toBe(3);
    expect(res.data?.popularMovies[2].popularity).toBe(1);
  });

  it('should update a movie', async () => {
    const CREATE = `
      mutation CreateMovie($input: MovieInput!) {
        createMovie(input: $input) { id title }
      }
    `;
    const input = { title: 'To Update' };
    const createRes = await server.executeOperation({ query: CREATE, variables: { input } });
    const id = createRes.data?.createMovie.id;
    const UPDATE = `
      mutation UpdateMovie($id: ID!, $input: MovieInput!) {
        updateMovie(id: $id, input: $input) { id title popularity }
      }
    `;
    const updateRes = await server.executeOperation({
      query: UPDATE,
      variables: { id, input: { popularity: 10, title: 'Updated' } },
    });
    expect(updateRes.errors).toBeUndefined();
    expect(updateRes.data?.updateMovie).toMatchObject({ id, popularity: 10, title: 'Updated' });
  });

  it('should return null for non-existent movie', async () => {
    const GET = `
      query Movie($id: ID!) {
        movie(id: $id) { id }
      }
    `;
    const res = await server.executeOperation({ query: GET, variables: { id: 'non-existent-id' } });
    expect(res.errors).toBeUndefined();
    expect(res.data?.movie).toBeNull();
  });
}); 