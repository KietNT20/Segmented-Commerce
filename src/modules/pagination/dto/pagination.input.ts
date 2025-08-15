import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsPositive, Max, Min } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(() => Int)
  @IsOptional()
  @IsPositive()
  @Min(1)
  offset?: number = 1;

  @Field(() => Int)
  @IsOptional()
  @IsPositive()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
