import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { PaginationInput } from 'src/modules/pagination/dto/pagination.input';
import { Role } from 'src/modules/roles/entities/role.entity';

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

    @Field(() => [Role], { nullable: true })
    @IsOptional()
    roles?: Role[];
}

@InputType()
export class QueryUserInput extends IntersectionType(
    FilterUserInput,
    PaginationInput,
) {}
