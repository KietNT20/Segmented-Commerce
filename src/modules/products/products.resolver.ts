import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateProductInput } from './dto/create-product.input';
import { PaginatedProduct, QueryProductInput } from './dto/query-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Product)
export class ProductsResolver {
    constructor(private readonly productsService: ProductsService) {}

    @Mutation(() => Product)
    createProduct(
        @Args('createProductInput') createProductInput: CreateProductInput,
    ) {
        return this.productsService.create(createProductInput);
    }

    @Query(() => PaginatedProduct, { name: 'products' })
    findAll(@Args('queryProductInput') queryProductInput: QueryProductInput) {
        return this.productsService.findAll(queryProductInput);
    }

    @Query(() => Product, { name: 'product' })
    findOne(@Args('id', { type: () => ID }) id: string) {
        return this.productsService.findOne(id);
    }

    @Mutation(() => Product)
    updateProduct(
        @Args('updateProductInput') updateProductInput: UpdateProductInput,
    ) {
        return this.productsService.update(
            updateProductInput.id,
            updateProductInput,
        );
    }

    @Mutation(() => Product)
    removeProduct(@Args('id', { type: () => ID }) id: string) {
        return this.productsService.remove(id);
    }
}
