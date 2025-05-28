import { InputType, Float, Field, Int } from "@nestjs/graphql";
import { Min, Max, IsOptional } from "class-validator";

@InputType()
export class FindHighestRatedMovies {
  @Field(() => Float)
  @Min(0)
  @Max(10)
  minRating: number;

  @Field(() => Int)
  @IsOptional()
  @Min(0)
  @Max(100)
  quantity?: number = 0;
}
