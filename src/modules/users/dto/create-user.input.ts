import { Field, ID, InputType } from '@nestjs/graphql';
import {
    ArrayUnique,
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { REGEX } from 'src/constants';
import { Gender } from '../enums/gender.enum';

@InputType()
export class CreateUserInput {
    @Field(() => String, { description: 'User email' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Field(() => String, { description: 'User password' })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(REGEX.PWD, {
        message:
            'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character',
    })
    password: string;

    @Field(() => String, { description: 'User first name' })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @Field(() => String, { description: 'User last name' })
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @Field(() => String, { nullable: true, description: 'User phone' })
    @IsOptional()
    @IsString()
    @Matches(REGEX.VN_PHONE, {
        message: 'Phone number must be a valid Vietnamese phone number',
    })
    phone?: string;

    @Field(() => Gender, { nullable: true, description: 'User gender' })
    @IsOptional()
    gender?: Gender;

    @Field(() => [ID], { description: 'List of Role IDs assigned to user' })
    @IsArray()
    @ArrayUnique()
    @IsUUID('4', { each: true })
    @IsNotEmpty()
    userRoleIds: string[];

    @Field(() => ID, { nullable: true, description: 'Customer ID' })
    @IsOptional()
    @IsUUID()
    customerId?: string;
}
