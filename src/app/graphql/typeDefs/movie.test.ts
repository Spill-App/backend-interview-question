import { print } from 'graphql';
import movie from './movie';

describe('movie typeDefs', () => {
  it('should define Movie type with required fields', () => {
    const printed = print(movie);
    expect(printed).toContain('type Movie');
    expect(printed).toContain('id: ID!');
    expect(printed).toContain('title: String!');
    expect(printed).toContain('description: String');
    expect(printed).toContain('releaseDate: String');
    expect(printed).toContain('popularity: Float');
  });
}); 