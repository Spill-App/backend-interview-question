import { gql } from 'apollo-server';
import movie from './movie';
import query from './query';
import mutation from './mutation';

const typeDefs = gql`
  ${movie}
  ${query}
  ${mutation}
`;

export default typeDefs; 