import { Test, TestingModule } from '@nestjs/testing';
import { ProductUnitResolver } from './product_unit.resolver';
import { ProductUnitService } from './product_unit.service';

describe('ProductUnitResolver', () => {
    let resolver: ProductUnitResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProductUnitResolver, ProductUnitService],
        }).compile();

        resolver = module.get<ProductUnitResolver>(ProductUnitResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
