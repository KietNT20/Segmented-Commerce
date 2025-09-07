import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateProductUnitInput {
    @Field(() => Int, { description: 'Example field (placeholder)' })
    exampleField: number;
}
