import { gql } from 'apollo-server';

const mutation = gql`
  type Mutation {
    createMovie(input: MovieInput!): Movie
    updateMovie(id: ID!, input: MovieInput!): Movie
  }
`;

export default mutation; 