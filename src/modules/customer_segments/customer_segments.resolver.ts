import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CustomerSegmentsService } from './customer_segments.service';
import { CustomerSegment } from './entities/customer_segment.entity';
import { CreateCustomerSegmentInput } from './dto/create-customer_segment.input';
import { UpdateCustomerSegmentInput } from './dto/update-customer_segment.input';

@Resolver(() => CustomerSegment)
export class CustomerSegmentsResolver {
  constructor(private readonly customerSegmentsService: CustomerSegmentsService) {}

  @Mutation(() => CustomerSegment)
  createCustomerSegment(@Args('createCustomerSegmentInput') createCustomerSegmentInput: CreateCustomerSegmentInput) {
    return this.customerSegmentsService.create(createCustomerSegmentInput);
  }

  @Query(() => [CustomerSegment], { name: 'customerSegments' })
  findAll() {
    return this.customerSegmentsService.findAll();
  }

  @Query(() => CustomerSegment, { name: 'customerSegment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.customerSegmentsService.findOne(id);
  }

  @Mutation(() => CustomerSegment)
  updateCustomerSegment(@Args('updateCustomerSegmentInput') updateCustomerSegmentInput: UpdateCustomerSegmentInput) {
    return this.customerSegmentsService.update(updateCustomerSegmentInput.id, updateCustomerSegmentInput);
  }

  @Mutation(() => CustomerSegment)
  removeCustomerSegment(@Args('id', { type: () => Int }) id: number) {
    return this.customerSegmentsService.remove(id);
  }
}
