import { InputType, Field, Float, GraphQLISODateTime } from "@nestjs/graphql";
import { IsNotEmpty, IsString, Min, Max, IsDate, IsOptional } from "class-validator";

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

  @Field(() => GraphQLISODateTime)
  @IsDate()
  releaseDate: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  genre?: string;
}
