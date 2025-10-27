import {
    Field,
    InputType,
    IntersectionType,
    ObjectType,
} from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { PaginationInput } from 'src/modules/pagination/dto/pagination.input';
import { Paginated } from 'src/modules/pagination/interface/paginated.interface';
import { Product } from '../entities/product.entity';

@InputType()
export class QueryProductFilter {
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    productName?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    productSKU?: string;
}

@InputType()
export class QueryProductInput extends IntersectionType(
    QueryProductFilter,
    PaginationInput,
) {}

@ObjectType()
export class PaginatedProduct extends Paginated(Product) {}
