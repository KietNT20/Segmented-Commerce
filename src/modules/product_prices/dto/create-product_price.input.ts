import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateProductPriceInput {
    @Field(() => Int, { description: 'Example field (placeholder)' })
    exampleField: number;
}
