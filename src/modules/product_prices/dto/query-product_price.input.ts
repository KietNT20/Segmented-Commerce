import { Field, InputType, Int, IntersectionType } from '@nestjs/graphql';
import { PaginationInput } from 'src/modules/pagination/dto/pagination.input';

@InputType()
export class QueryProductPriceFilter {
    @Field(() => Int, { description: 'Giá tối thiểu' })
    minPrice: number;

    @Field(() => Int, { description: 'Giá tối đa' })
    maxPrice: number;
}

@InputType()
export class QueryProductPriceInput extends IntersectionType(
    QueryProductPriceFilter,
    PaginationInput,
) {}
