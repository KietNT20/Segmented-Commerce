import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductUnitService } from './product_unit.service';
import { ProductUnit } from './entities/product_unit.entity';
import { CreateProductUnitInput } from './dto/create-product_unit.input';
import { UpdateProductUnitInput } from './dto/update-product_unit.input';

@Resolver(() => ProductUnit)
export class ProductUnitResolver {
    constructor(private readonly productUnitService: ProductUnitService) {}

    @Mutation(() => ProductUnit)
    createProductUnit(
        @Args('createProductUnitInput')
        createProductUnitInput: CreateProductUnitInput,
    ) {
        return this.productUnitService.create(createProductUnitInput);
    }

    @Query(() => [ProductUnit], { name: 'productUnit' })
    findAll() {
        return this.productUnitService.findAll();
    }

    @Query(() => ProductUnit, { name: 'productUnit' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.productUnitService.findOne(id);
    }

    @Mutation(() => ProductUnit)
    updateProductUnit(
        @Args('updateProductUnitInput')
        updateProductUnitInput: UpdateProductUnitInput,
    ) {
        return this.productUnitService.update(
            updateProductUnitInput.id,
            updateProductUnitInput,
        );
    }

    @Mutation(() => ProductUnit)
    removeProductUnit(@Args('id', { type: () => Int }) id: number) {
        return this.productUnitService.remove(id);
    }
}
