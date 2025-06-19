import { ensureMoviesTable, getDocumentClient, TABLE_NAME } from '../../db';
import { createMovie, getMovie, listPopularMovies, updateMovie, Movie } from './movieService';

describe('movieService', () => {
  beforeAll(async () => {
    await ensureMoviesTable();
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

  it('should create and get a movie', async () => {
    const input = {
      title: 'Test Movie',
      description: 'A test movie',
      releaseDate: '2020-01-01',
      popularity: 7.5,
    };
    const created = await createMovie(input);
    expect(created).toMatchObject(input);
    expect(created.id).toBeDefined();

    const fetched = await getMovie(created.id);
    expect(fetched).toEqual(created);
  });

  it('should list popular movies in order', async () => {
    const movies = [
      { title: 'A', popularity: 1 },
      { title: 'B', popularity: 5 },
      { title: 'C', popularity: 3 },
    ];
    for (const m of movies) {
      await createMovie({ ...m });
    }
    const listed = await listPopularMovies(3);
    expect(listed.length).toBe(3);
    expect(listed[0].popularity).toBe(5);
    expect(listed[1].popularity).toBe(3);
    expect(listed[2].popularity).toBe(1);
  });

  it('should update a movie', async () => {
    const created = await createMovie({ title: 'To Update' });
    const updated = await updateMovie(created.id, { popularity: 10, title: 'Updated' });
    expect(updated).toMatchObject({ id: created.id, popularity: 10, title: 'Updated' });
    const fetched = await getMovie(created.id);
    expect(fetched).toMatchObject({ id: created.id, popularity: 10, title: 'Updated' });
  });

  it('should return undefined for non-existent movie', async () => {
    const movie = await getMovie('non-existent-id');
    expect(movie).toBeUndefined();
  });
}); 