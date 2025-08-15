import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCustomerSegmentInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
