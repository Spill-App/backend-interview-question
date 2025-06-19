import { print } from 'graphql';
import mutation from './mutation';

describe('mutation typeDefs', () => {
  it('should define mutations for Movie', () => {
    const printed = print(mutation);
    expect(printed).toContain('type Mutation');
    expect(printed).toContain('createMovie');
    expect(printed).toContain('updateMovie');
  });
}); 