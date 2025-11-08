import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../permissions/permissions.module';
import { Product } from './entities/product.entity';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';

@Module({
    imports: [TypeOrmModule.forFeature([Product]), PermissionsModule],
    providers: [ProductsResolver, ProductsService],
    exports: [ProductsService],
})
export class ProductsModule {}
