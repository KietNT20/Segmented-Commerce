import { Field, ID, InputType, IntersectionType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationInput } from 'src/modules/pagination/dto/pagination.input';

@InputType()
export class FilterUserInput {
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    email?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    phone?: string;

    @Field(() => [ID], { nullable: true })
    @IsOptional()
    @IsUUID(4, { each: true })
    roleIds?: string[];
}

@InputType()
export class QueryUserInput extends IntersectionType(
    FilterUserInput,
    PaginationInput,
) {}
