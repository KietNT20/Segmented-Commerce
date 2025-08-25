import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCustomerSegmentInput {
  @Field(() => String, { description: 'Name of the customer segment' })
  name: string;

  @Field(() => String, {
    description: 'Description of the customer segment',
    nullable: true,
  })
  description?: string;
}
