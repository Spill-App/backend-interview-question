import { gql } from 'apollo-server';

const query = gql`
  type Query {
    popularMovies(limit: Int): [Movie]
    movie(id: ID!): Movie
  }
`;

export default query; 