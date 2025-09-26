import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateProductPriceInput } from './create-product_price.input';

@InputType()
export class UpdateProductPriceInput extends PartialType(
    CreateProductPriceInput,
) {
    @Field(() => ID, { description: 'Product Price ID' })
    id: string;
}
