import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../permissions/permissions.module';
import { Product } from '../products/entities/product.entity';
import { ProductUnit } from './entities/product_unit.entity';
import { ProductUnitResolver } from './product_unit.resolver';
import { ProductUnitService } from './product_unit.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductUnit, Product]),
        PermissionsModule,
    ],
    providers: [ProductUnitResolver, ProductUnitService],
    exports: [ProductUnitService],
})
export class ProductUnitModule {}
