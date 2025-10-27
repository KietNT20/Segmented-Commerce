import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductPriceInput } from './dto/create-product_price.input';
import {
    PaginatedProductPrice,
    QueryProductPriceInput,
} from './dto/query-product_price.input';
import { UpdateProductPriceInput } from './dto/update-product_price.input';
import { ProductPrice } from './entities/product_price.entity';
import { ProductPricesService } from './product_prices.service';

@Resolver(() => ProductPrice)
export class ProductPricesResolver {
    constructor(private readonly productPricesService: ProductPricesService) {}

    @Mutation(() => ProductPrice)
    createProductPrice(
        @Args('createProductPriceInput')
        createProductPriceInput: CreateProductPriceInput,
    ) {
        return this.productPricesService.create(createProductPriceInput);
    }

    @Query(() => PaginatedProductPrice, { name: 'productPrices' })
    findAll(
        @Args('queryProductPriceInput')
        queryProductPriceInput: QueryProductPriceInput,
    ) {
        return this.productPricesService.findAll(queryProductPriceInput);
    }

    @Query(() => ProductPrice, { name: 'productPrice' })
    findOne(@Args('id', { type: () => ID }) id: string) {
        return this.productPricesService.findOne(id);
    }

    @Mutation(() => ProductPrice)
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
    removeProductPrice(@Args('id', { type: () => ID }) id: string) {
        return this.productPricesService.remove(id);
    }
}
