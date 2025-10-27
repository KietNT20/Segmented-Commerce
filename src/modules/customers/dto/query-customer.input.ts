import {
    Field,
    InputType,
    IntersectionType,
    ObjectType,
} from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { PaginationInput } from 'src/modules/pagination/dto/pagination.input';
import { Paginated } from 'src/modules/pagination/interface/paginated.interface';
import { Customer } from '../entities/customer.entity';

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

@ObjectType()
export class PaginatedCustomer extends Paginated(Customer) {}
