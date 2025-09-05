import { Field, InputType, Int } from '@nestjs/graphql';
import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsPositive,
    Max,
    Min,
} from 'class-validator';
import { SortOrder } from '../interface/paginated.interface';

@InputType()
export class PaginationInput {
    @Field(() => SortOrder, { nullable: true, defaultValue: SortOrder.DESC })
    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder = SortOrder.DESC;

    @Field(() => Int, { defaultValue: 1 })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(1)
    offset?: number = 1;

    @Field(() => Int, { defaultValue: 10 })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(100)
    limit?: number = 10;
}
