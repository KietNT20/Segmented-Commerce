import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RequirePermission } from 'src/decorators/permission.decorator';
import { GqlAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { Action, Resource } from '../roles/enums';
import { CreateProductPriceInput } from './dto/create-product_price.input';
import {
    PaginatedProductPrice,
    QueryProductPriceInput,
} from './dto/query-product_price.input';
import { UpdateProductPriceInput } from './dto/update-product_price.input';
import { ProductPrice } from './entities/product_price.entity';
import { ProductPricesService } from './product_prices.service';

@UseGuards(GqlAuthGuard, PermissionGuard)
@Resolver(() => ProductPrice)
export class ProductPricesResolver {
    constructor(private readonly productPricesService: ProductPricesService) {}

    @Mutation(() => ProductPrice)
    @RequirePermission(Resource.PRODUCT_PRICES, Action.CREATE)
    createProductPrice(
        @Args('createProductPriceInput')
        createProductPriceInput: CreateProductPriceInput,
    ) {
        return this.productPricesService.create(createProductPriceInput);
    }

    @Query(() => PaginatedProductPrice, { name: 'productPrices' })
    @RequirePermission(Resource.PRODUCT_PRICES, Action.READ)
    findAll(
        @Args('queryProductPriceInput')
        queryProductPriceInput: QueryProductPriceInput,
    ) {
        return this.productPricesService.findAll(queryProductPriceInput);
    }

    @Query(() => ProductPrice, { name: 'productPrice' })
    @RequirePermission(Resource.PRODUCT_PRICES, Action.READ)
    findOne(@Args('id', { type: () => ID }) id: string) {
        return this.productPricesService.findOne(id);
    }

    @Mutation(() => ProductPrice)
    @RequirePermission(Resource.PRODUCT_PRICES, Action.UPDATE)
    updateProductPrice(
        @Args('updateProductPriceInput')
        updateProductPriceInput: UpdateProductPriceInput,
    ) {
        return this.productPricesService.update(
            updateProductPriceInput.id,
            updateProductPriceInput,
        );
    }

    @Mutation(() => ProductPrice)
    @RequirePermission(Resource.PRODUCT_PRICES, Action.DELETE)
    removeProductPrice(@Args('id', { type: () => ID }) id: string) {
        return this.productPricesService.remove(id);
    }
}
