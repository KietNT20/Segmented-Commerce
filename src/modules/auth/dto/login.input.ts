import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LoginInput {
    @Field(() => String, { description: 'User email' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Field(() => String, { description: 'User password' })
    @IsNotEmpty()
    @IsString()
    password: string;
}
