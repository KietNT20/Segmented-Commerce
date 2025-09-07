import { Test, TestingModule } from '@nestjs/testing';
import { ProductPricesResolver } from './product_prices.resolver';
import { ProductPricesService } from './product_prices.service';

describe('ProductPricesResolver', () => {
    let resolver: ProductPricesResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProductPricesResolver, ProductPricesService],
        }).compile();

        resolver = module.get<ProductPricesResolver>(ProductPricesResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
