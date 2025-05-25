import { Field, InputType } from 'type-graphql';

@InputType()
export class MovieInput {
    @Field()
    title: string;

    @Field((type) => [String])
    genres: string[];

    @Field()
    rating: number;
}
