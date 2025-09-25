import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPrice } from './entities/product_price.entity';
import { ProductPricesResolver } from './product_prices.resolver';
import { ProductPricesService } from './product_prices.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductPrice])],
    providers: [ProductPricesResolver, ProductPricesService],
    exports: [ProductPricesService],
})
export class ProductPricesModule {}
