import { Module } from '@nestjs/common';
import { ProductUnitResolver } from './product_unit.resolver';
import { ProductUnitService } from './product_unit.service';

@Module({
    providers: [ProductUnitResolver, ProductUnitService],
})
export class ProductUnitModule {}
