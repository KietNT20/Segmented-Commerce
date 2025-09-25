import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateProductUnitInput } from './create-product_unit.input';

@InputType()
export class UpdateProductUnitInput extends PartialType(
    CreateProductUnitInput,
) {
    @Field(() => ID)
    id: string;
}
