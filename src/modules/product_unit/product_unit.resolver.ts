import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RequirePermission } from 'src/decorators/permission.decorator';
import { GqlAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { Action, Resource } from '../roles/enums';
import { CreateProductUnitInput } from './dto/create-product_unit.input';
import { UpdateProductUnitInput } from './dto/update-product_unit.input';
import { ProductUnit } from './entities/product_unit.entity';
import { ProductUnitService } from './product_unit.service';

@UseGuards(GqlAuthGuard, PermissionGuard)
@Resolver(() => ProductUnit)
export class ProductUnitResolver {
    constructor(private readonly productUnitService: ProductUnitService) {}

    @Mutation(() => ProductUnit)
    @RequirePermission(Resource.PRODUCT_UNITS, Action.CREATE)
    createProductUnit(
        @Args('createProductUnitInput')
        createProductUnitInput: CreateProductUnitInput,
    ) {
        return this.productUnitService.create(createProductUnitInput);
    }

    @Query(() => [ProductUnit], { name: 'productUnits' })
    @RequirePermission(Resource.PRODUCT_UNITS, Action.READ)
    findAll() {
        return this.productUnitService.findAll();
    }

    @Query(() => ProductUnit, { name: 'productUnit' })
    @RequirePermission(Resource.PRODUCT_UNITS, Action.READ)
    findOne(@Args('id', { type: () => ID }) id: string) {
        return this.productUnitService.findOne(id);
    }

    @Mutation(() => ProductUnit)
    @RequirePermission(Resource.PRODUCT_UNITS, Action.UPDATE)
    updateProductUnit(
        @Args('updateProductUnitInput')
        updateProductUnitInput: UpdateProductUnitInput,
    ) {
        return this.productUnitService.update(
            updateProductUnitInput.id,
            updateProductUnitInput,
        );
    }

    @Mutation(() => Boolean)
    @RequirePermission(Resource.PRODUCT_UNITS, Action.DELETE)
    removeProductUnit(@Args('id', { type: () => ID }) id: string) {
        return this.productUnitService.remove(id);
    }
}
