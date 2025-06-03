import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { Inject } from "@nestjs/common";

import { Movie } from "./entities/movies.entity";

import { MoviesService } from "./movies.service";

import { CreateMovieInput } from "./dto/create-movie.input";
import { UpdateMovieInput } from "./dto/update-movie.input";
import { FindHighestRatedMovies } from "./dto/find-highest-rated-movies.input";
import { ComplexFilterInput } from "./dto/complex-filter.input";

@Resolver(() => Movie)
export class MoviesResolver {
  @Inject()
  private readonly moviesService: MoviesService;

  @Query(() => [Movie])
  movies() {
    return this.moviesService.findAll();
  }

  @Query(() => Movie)
  movie(@Args("id") id: string) {
    return this.moviesService.findOne(id);
  }

  @Query(() => [Movie])
  moviesByRating(@Args("input") input: FindHighestRatedMovies) {
    return this.moviesService.findHighestRatedMovies(input);
  }

  @Query(() => [Movie])
  moviesByComplexFilter(@Args("input") input: ComplexFilterInput) {
    return this.moviesService.findByComplexFilter(input);
  }

  @Mutation(() => Movie)
  createMovie(@Args("input") input: CreateMovieInput) {
    return this.moviesService.create(input);
  }

  @Mutation(() => Movie)
  updateMovie(@Args("input") input: UpdateMovieInput) {
    return this.moviesService.update(input);
  }

  @Mutation(() => Boolean)
  deleteMovie(@Args("id") id: string) {
    return this.moviesService.delete(id);
  }
}
