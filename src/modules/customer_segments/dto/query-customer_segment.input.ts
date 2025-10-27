import {
    Field,
    InputType,
    IntersectionType,
    ObjectType,
} from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { PaginationInput } from 'src/modules/pagination/dto/pagination.input';
import { Paginated } from 'src/modules/pagination/interface/paginated.interface';
import { CustomerSegment } from '../entities/customer_segment.entity';

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

@ObjectType()
export class PaginatedCustomerSegment extends Paginated(CustomerSegment) {}
