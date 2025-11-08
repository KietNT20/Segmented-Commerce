import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    RequireAllPermissions,
    RequirePermission,
} from 'src/decorators/permission.decorator';
import { GqlAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { Action, Resource } from '../roles/enums';
import { CreateProductInput } from './dto/create-product.input';
import { PaginatedProduct, QueryProductInput } from './dto/query-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@UseGuards(GqlAuthGuard, PermissionGuard)
@Resolver(() => Product)
export class ProductsResolver {
    constructor(private readonly productsService: ProductsService) {}

    @Mutation(() => Product)
    @RequireAllPermissions([
        { resource: Resource.PRODUCTS, action: Action.CREATE },
        { resource: Resource.PRODUCT_PRICES, action: Action.CREATE },
        { resource: Resource.PRODUCT_UNITS, action: Action.CREATE },
    ])
    createProduct(
        @Args('createProductInput') createProductInput: CreateProductInput,
    ) {
        return this.productsService.create(createProductInput);
    }

    @Query(() => PaginatedProduct, { name: 'products' })
    @RequirePermission(Resource.PRODUCTS, Action.READ)
    findAll(@Args('queryProductInput') queryProductInput: QueryProductInput) {
        return this.productsService.findAll(queryProductInput);
    }

    @Query(() => Product, { name: 'product' })
    @RequirePermission(Resource.PRODUCTS, Action.READ)
    findOne(@Args('id', { type: () => ID }) id: string) {
        return this.productsService.findOne(id);
    }

    @Mutation(() => Product)
    @RequireAllPermissions([
        { resource: Resource.PRODUCTS, action: Action.UPDATE },
        { resource: Resource.PRODUCT_PRICES, action: Action.UPDATE },
        { resource: Resource.PRODUCT_UNITS, action: Action.UPDATE },
    ])
    updateProduct(
        @Args('updateProductInput') updateProductInput: UpdateProductInput,
    ) {
        return this.productsService.update(
            updateProductInput.id,
            updateProductInput,
        );
    }

    @Mutation(() => Product)
    @RequireAllPermissions([
        { resource: Resource.PRODUCTS, action: Action.DELETE },
        { resource: Resource.PRODUCT_PRICES, action: Action.DELETE },
        { resource: Resource.PRODUCT_UNITS, action: Action.DELETE },
    ])
    removeProduct(@Args('id', { type: () => ID }) id: string) {
        return this.productsService.remove(id);
    }
}
