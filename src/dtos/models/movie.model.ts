import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class MovieModel {
    @Field((type) => ID)
    id: string;

    @Field()
    title: string;

    @Field((type) => [String])
    genres: string[];

    @Field()
    rating: number;
}
