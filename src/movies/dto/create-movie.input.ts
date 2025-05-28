import { InputType, Field, Float } from "@nestjs/graphql";
import { IsNotEmpty, IsString, Min, Max } from "class-validator";

@InputType()
export class CreateMovieInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsString()
  director: string;

  @Field(() => Float)
  @Min(0)
  @Max(10)
  rating: number;
}
