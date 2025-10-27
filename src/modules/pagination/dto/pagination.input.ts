import { ArgsType, Field, Int } from '@nestjs/graphql';
import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsPositive,
    Max,
    Min,
} from 'class-validator';
import { SortOrder } from '../interface/paginated.interface';

@ArgsType()
export class PaginationInput {
    @Field(() => SortOrder, { nullable: true, defaultValue: SortOrder.DESC })
    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder = SortOrder.DESC;

    @Field(() => Int, { defaultValue: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    offset?: number = 0;

    @Field(() => Int, { defaultValue: 10 })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(100)
    limit?: number = 10;
}
