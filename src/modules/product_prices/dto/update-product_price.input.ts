import { CreateProductPriceInput } from './create-product_price.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductPriceInput extends PartialType(
    CreateProductPriceInput,
) {
    @Field(() => Int)
    id: number;
}
