import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { PaginationInput } from 'src/modules/pagination/dto/pagination.input';

@InputType()
export class FilterCustomerInput {
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    companyName?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    customerCode?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    address?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    city?: string;
}

@InputType()
export class QueryCustomerInput extends IntersectionType(
    FilterCustomerInput,
    PaginationInput,
) {}
