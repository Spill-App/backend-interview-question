import { print } from 'graphql';
import query from './query';

describe('query typeDefs', () => {
  it('should define queries for Movie', () => {
    const printed = print(query);
    expect(printed).toContain('type Query');
    expect(printed).toContain('popularMovies');
    expect(printed).toContain('movie');
  });
}); 