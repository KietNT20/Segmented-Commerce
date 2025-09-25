import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CustomerSegmentsService } from './customer_segments.service';
import { CreateCustomerSegmentInput } from './dto/create-customer_segment.input';
import { QueryCustomerSegmentInput } from './dto/query-customer_segment.input';
import { UpdateCustomerSegmentInput } from './dto/update-customer_segment.input';
import { CustomerSegment } from './entities/customer_segment.entity';

@Resolver(() => CustomerSegment)
export class CustomerSegmentsResolver {
    constructor(
        private readonly customerSegmentsService: CustomerSegmentsService,
    ) {}

    @Mutation(() => CustomerSegment)
    createCustomerSegment(
        @Args('createCustomerSegmentInput')
        createCustomerSegmentInput: CreateCustomerSegmentInput,
    ) {
        return this.customerSegmentsService.create(createCustomerSegmentInput);
    }

    @Query(() => [CustomerSegment], { name: 'customerSegments' })
    findAll(
        @Args('queryCustomerSegmentInput', {
            type: () => QueryCustomerSegmentInput,
        })
        queryCustomerSegmentInput: QueryCustomerSegmentInput,
    ) {
        return this.customerSegmentsService.findAll(queryCustomerSegmentInput);
    }

    @Query(() => CustomerSegment, { name: 'customerSegment' })
    findOne(@Args('id', { type: () => ID }) id: string) {
        return this.customerSegmentsService.findOne(id);
    }

    @Mutation(() => CustomerSegment)
    updateCustomerSegment(
        @Args('updateCustomerSegmentInput')
        updateCustomerSegmentInput: UpdateCustomerSegmentInput,
    ) {
        return this.customerSegmentsService.update(
            updateCustomerSegmentInput.id,
            updateCustomerSegmentInput,
        );
    }

    @Mutation(() => CustomerSegment)
    removeCustomerSegment(@Args('id', { type: () => ID }) id: string) {
        return this.customerSegmentsService.remove(id);
    }
}
