import { Field, InputType, Int, IntersectionType } from '@nestjs/graphql';
import { IsNumber, IsPositive } from 'class-validator';
import { PaginationInput } from 'src/modules/pagination/dto/pagination.input';

@InputType()
export class QueryProductPriceFilter {
    @Field(() => Int, { description: 'Giá tối thiểu' })
    @IsPositive()
    @IsNumber()
    minPrice: number;

    @Field(() => Int, { description: 'Giá tối đa' })
    @IsPositive()
    @IsNumber()
    maxPrice: number;
}

@InputType()
export class QueryProductPriceInput extends IntersectionType(
    QueryProductPriceFilter,
    PaginationInput,
) {}
