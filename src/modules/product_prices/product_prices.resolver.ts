import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductPricesService } from './product_prices.service';
import { ProductPrice } from './entities/product_price.entity';
import { CreateProductPriceInput } from './dto/create-product_price.input';
import { UpdateProductPriceInput } from './dto/update-product_price.input';

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

    @Query(() => [ProductPrice], { name: 'productPrices' })
    findAll() {
        return this.productPricesService.findAll();
    }

    @Query(() => ProductPrice, { name: 'productPrice' })
    findOne(@Args('id', { type: () => Int }) id: number) {
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
    removeProductPrice(@Args('id', { type: () => Int }) id: number) {
        return this.productPricesService.remove(id);
    }
}
