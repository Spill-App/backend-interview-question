import { gql } from 'apollo-server';

const movie = gql`
  type Movie {
    id: ID!
    title: String!
    description: String
    releaseDate: String
    popularity: Float
  }
  input MovieInput {
    title: String!
    description: String
    releaseDate: String
    popularity: Float
  }
`;

export default movie; 