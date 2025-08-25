import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { REGEX } from 'src/constants';
import { Role } from '../enums';

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

  @Field(() => String, { description: 'User phone' })
  @IsNotEmpty()
  @IsString()
  @Matches(REGEX.VN_PHONE, {
    message: 'Phone number must be a valid Vietnamese phone number',
  })
  phone: string;

  @Field(() => Role, { description: 'User role' })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  @Field(() => ID, { nullable: true, description: 'Customer ID' })
  @IsOptional()
  @IsUUID()
  customerId?: string;
}
