import { ObjectType, Field, ID, Float } from "@nestjs/graphql";
import { GraphQLISODateTime } from "@nestjs/graphql";

@ObjectType()
export class Movie {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  director: string;

  @Field(() => Float)
  rating: number;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
