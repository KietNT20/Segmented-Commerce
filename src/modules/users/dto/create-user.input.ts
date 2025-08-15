import { Field, InputType } from '@nestjs/graphql';
import { Role } from '../enums';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'User email' })
  email: string;

  @Field(() => String, { description: 'User password' })
  password: string;

  @Field(() => String, { description: 'User first name' })
  firstName: string;

  @Field(() => String, { description: 'User last name' })
  lastName: string;

  @Field(() => String, { description: 'User phone' })
  phone: string;

  @Field(() => Role, { description: 'User role' })
  role: Role;
}
