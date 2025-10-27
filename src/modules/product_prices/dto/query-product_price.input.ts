import {
    Field,
    InputType,
    Int,
    IntersectionType,
    ObjectType,
} from '@nestjs/graphql';
import { IsNumber, IsPositive, Min } from 'class-validator';
import { PaginationInput } from 'src/modules/pagination/dto/pagination.input';
import { Paginated } from 'src/modules/pagination/interface/paginated.interface';
import { ProductPrice } from '../entities/product_price.entity';

@InputType()
export class QueryProductPriceFilter {
    @Field(() => Int, { description: 'Giá tối thiểu' })
    @IsNumber()
    @Min(0)
    minPrice: number;

    @Field(() => Int, { description: 'Giá tối đa' })
    @IsNumber()
    @IsPositive()
    maxPrice: number;
}

@InputType()
export class QueryProductPriceInput extends IntersectionType(
    QueryProductPriceFilter,
    PaginationInput,
) {}

@ObjectType()
export class PaginatedProductPrice extends Paginated(ProductPrice) {}
