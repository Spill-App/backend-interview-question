import { InputType, Field, Float } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsOptional, Min, Max } from "class-validator";

@InputType()
export class UpdateMovieInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  director?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @Min(0)
  @Max(10)
  rating?: number;
}
