import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { PaginationInput } from 'src/modules/pagination/dto/pagination.input';

@InputType()
export class QueryCustomerSegmentFilter {
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    customerSegmentCode?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    name?: string;
}

@InputType()
export class QueryCustomerSegmentInput extends IntersectionType(
    QueryCustomerSegmentFilter,
    PaginationInput,
) {}
