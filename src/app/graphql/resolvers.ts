import * as movieService from '../services/movieService';

const resolvers = {
  Query: {
    popularMovies: (_: unknown, { limit }: { limit: number }) => movieService.listPopularMovies(limit),
    movie: (_: unknown, { id }: { id: string }) => movieService.getMovie(id),
  },
  Mutation: {
    createMovie: (_: unknown, { input }: any) => movieService.createMovie(input),
    updateMovie: (_: unknown, { id, input }: any) => movieService.updateMovie(id, input),
  },
};

export default resolvers; 