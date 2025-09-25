import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductUnitInput } from './dto/create-product_unit.input';
import { UpdateProductUnitInput } from './dto/update-product_unit.input';
import { ProductUnit } from './entities/product_unit.entity';
import { ProductUnitService } from './product_unit.service';

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

    @Query(() => [ProductUnit], { name: 'productUnits' })
    findAll() {
        return this.productUnitService.findAll();
    }

    @Query(() => ProductUnit, { name: 'productUnit' })
    findOne(@Args('id', { type: () => ID }) id: string) {
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

    @Mutation(() => Boolean)
    removeProductUnit(@Args('id', { type: () => ID }) id: string) {
        return this.productUnitService.remove(id);
    }
}
