import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RequirePermission } from 'src/decorators/permission.decorator';
import { GqlAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { Action, Resource } from '../roles/enums';
import { CustomersService } from './customers.service';
import { CreateCustomerInput } from './dto/create-customer.input';
import {
    PaginatedCustomer,
    QueryCustomerInput,
} from './dto/query-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { Customer } from './entities/customer.entity';

@Resolver(() => Customer)
@UseGuards(GqlAuthGuard, PermissionGuard)
export class CustomersResolver {
    constructor(private readonly customersService: CustomersService) {}

    @Mutation(() => Customer)
    @RequirePermission(Resource.CUSTOMERS, Action.CREATE)
    createCustomer(
        @Args('createCustomerInput') createCustomerInput: CreateCustomerInput,
    ) {
        return this.customersService.create(createCustomerInput);
    }

    @Query(() => PaginatedCustomer, { name: 'customers' })
    @RequirePermission(Resource.CUSTOMERS, Action.READ)
    findAll(
        @Args('queryCustomerInput') queryCustomerInput: QueryCustomerInput,
    ) {
        return this.customersService.findAll(queryCustomerInput);
    }

    @Query(() => Customer, { name: 'customer' })
    @RequirePermission(Resource.CUSTOMERS, Action.READ)
    findOne(@Args('id', { type: () => ID }) id: string) {
        return this.customersService.findOne(id);
    }

    @Mutation(() => Customer)
    @RequirePermission(Resource.CUSTOMERS, Action.UPDATE)
    updateCustomer(
        @Args('updateCustomerInput') updateCustomerInput: UpdateCustomerInput,
    ) {
        return this.customersService.update(
            updateCustomerInput.id,
            updateCustomerInput,
        );
    }

    @Mutation(() => Customer)
    @RequirePermission(Resource.CUSTOMERS, Action.DELETE)
    softRemoveCustomer(@Args('id', { type: () => ID }) id: string) {
        return this.customersService.softRemove(id);
    }

    @Mutation(() => Customer)
    @RequirePermission(Resource.CUSTOMERS, Action.DELETE)
    removeCustomer(@Args('id', { type: () => ID }) id: string) {
        return this.customersService.remove(id);
    }
}
