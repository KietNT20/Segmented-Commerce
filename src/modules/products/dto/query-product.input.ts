import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { PaginationInput } from 'src/modules/pagination/dto/pagination.input';

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
