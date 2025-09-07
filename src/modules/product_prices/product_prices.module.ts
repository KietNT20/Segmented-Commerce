import { Module } from '@nestjs/common';
import { ProductPricesService } from './product_prices.service';
import { ProductPricesResolver } from './product_prices.resolver';

@Module({
    providers: [ProductPricesResolver, ProductPricesService],
})
export class ProductPricesModule {}
