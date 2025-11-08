import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RequirePermission } from 'src/decorators/permission.decorator';
import { GqlAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { Action, Resource } from '../roles/enums';
import { CustomerSegmentsService } from './customer_segments.service';
import { CreateCustomerSegmentInput } from './dto/create-customer_segment.input';
import {
    PaginatedCustomerSegment,
    QueryCustomerSegmentInput,
} from './dto/query-customer_segment.input';
import { UpdateCustomerSegmentInput } from './dto/update-customer_segment.input';
import { CustomerSegment } from './entities/customer_segment.entity';

@UseGuards(GqlAuthGuard, PermissionGuard)
@Resolver(() => CustomerSegment)
export class CustomerSegmentsResolver {
    constructor(
        private readonly customerSegmentsService: CustomerSegmentsService,
    ) {}

    @Mutation(() => CustomerSegment)
    @RequirePermission(Resource.CUSTOMER_SEGMENTS, Action.CREATE)
    createCustomerSegment(
        @Args('createCustomerSegmentInput')
        createCustomerSegmentInput: CreateCustomerSegmentInput,
    ) {
        return this.customerSegmentsService.create(createCustomerSegmentInput);
    }

    @Query(() => PaginatedCustomerSegment, { name: 'customerSegments' })
    @RequirePermission(Resource.CUSTOMER_SEGMENTS, Action.READ)
    findAll(
        @Args('queryCustomerSegmentInput', {
            type: () => QueryCustomerSegmentInput,
        })
        queryCustomerSegmentInput: QueryCustomerSegmentInput,
    ) {
        return this.customerSegmentsService.findAll(queryCustomerSegmentInput);
    }

    @Query(() => CustomerSegment, { name: 'customerSegment' })
    @RequirePermission(Resource.CUSTOMER_SEGMENTS, Action.READ)
    findOne(@Args('id', { type: () => ID }) id: string) {
        return this.customerSegmentsService.findOne(id);
    }

    @Mutation(() => CustomerSegment)
    @RequirePermission(Resource.CUSTOMER_SEGMENTS, Action.UPDATE)
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
    @RequirePermission(Resource.CUSTOMER_SEGMENTS, Action.DELETE)
    removeCustomerSegment(@Args('id', { type: () => ID }) id: string) {
        return this.customerSegmentsService.remove(id);
    }
}
