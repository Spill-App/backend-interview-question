import { InputType, Field, Float, Int } from "@nestjs/graphql";
import { IsString, Min, Max, IsOptional } from "class-validator";

@InputType()
export class ComplexFilterInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  genre?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @Min(0)
  @Max(10)
  minRating?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @Min(0)
  @Max(10)
  maxRating?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1900)
  @Max(2025)
  minYear?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1900)
  @Max(2025)
  maxYear?: number;
}
