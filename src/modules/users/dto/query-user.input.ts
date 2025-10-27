import {
    Field,
    ID,
    InputType,
    IntersectionType,
    ObjectType,
} from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationInput } from 'src/modules/pagination/dto/pagination.input';
import { Paginated } from 'src/modules/pagination/interface/paginated.interface';
import { User } from '../entities/user.entity';

@InputType()
export class FilterUserInput {
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    email?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    firstName?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    lastName?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    phone?: string;

    @Field(() => [ID], { nullable: true })
    @IsOptional()
    @IsUUID(4, { each: true })
    roleIds?: string[];

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    @IsEnum(['firstName', 'lastName', 'email', 'createdAt', 'updatedAt'])
    orderBy?: string;
}

@InputType()
export class QueryUserInput extends IntersectionType(
    FilterUserInput,
    PaginationInput,
) {}

@ObjectType()
export class PaginatedUser extends Paginated(User) {}
