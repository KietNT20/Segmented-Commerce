import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginOutput {
  @Field(() => String)
  access_token: string;

  @Field(() => String)
  refresh_token: string;
}
