import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateCustomerSegmentInput } from './create-customer_segment.input';

@InputType()
export class UpdateCustomerSegmentInput extends PartialType(
    CreateCustomerSegmentInput,
) {
    @Field(() => ID)
    id: string;
}
