import { CreateProductUnitInput } from './create-product_unit.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductUnitInput extends PartialType(
    CreateProductUnitInput,
) {
    @Field(() => Int)
    id: number;
}
