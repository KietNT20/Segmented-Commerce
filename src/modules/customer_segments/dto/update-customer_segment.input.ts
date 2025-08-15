import { CreateCustomerSegmentInput } from './create-customer_segment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCustomerSegmentInput extends PartialType(CreateCustomerSegmentInput) {
  @Field(() => Int)
  id: number;
}
