import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SortOrder } from '../pagination/interface/paginated.interface';
import { Product } from '../products/entities/product.entity';
import { CreateProductUnitInput } from './dto/create-product_unit.input';
import { UpdateProductUnitInput } from './dto/update-product_unit.input';
import { ProductUnit } from './entities/product_unit.entity';

@Injectable()
export class ProductUnitService {
    constructor(
        @InjectRepository(ProductUnit)
        private readonly productUnitRepository: Repository<ProductUnit>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async create(
        createProductUnitInput: CreateProductUnitInput,
    ): Promise<ProductUnit> {
        const { productId, ...rest } = createProductUnitInput;

        const product = await this.productRepository.findOne({
            where: { id: productId },
        });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const unit = this.productUnitRepository.create({ ...rest, product });
        return this.productUnitRepository.save(unit);
    }

    async findAll(): Promise<ProductUnit[]> {
        return this.productUnitRepository.find({
            relations: { product: true },
            order: { unitName: SortOrder.ASC },
        });
    }

    async findOne(id: string): Promise<ProductUnit> {
        const unit = await this.productUnitRepository.findOne({
            where: { id },
            relations: { product: true },
        });
        if (!unit) {
            throw new NotFoundException('Product unit not found');
        }
        return unit;
    }

    async update(
        id: string,
        updateProductUnitInput: UpdateProductUnitInput,
    ): Promise<ProductUnit> {
        const unit = await this.productUnitRepository.findOne({
            where: { id },
        });
        if (!unit) {
            throw new NotFoundException('Product unit not found');
        }

        let product: Product | null = null;
        if (updateProductUnitInput.productId) {
            product = await this.productRepository.findOne({
                where: { id: updateProductUnitInput.productId },
            });
            if (!product) {
                throw new NotFoundException('Product not found');
            }
        }

        const merged = this.productUnitRepository.merge(unit, {
            ...updateProductUnitInput,
            product: product ?? unit.product,
        });

        return this.productUnitRepository.save(merged);
    }

    async remove(id: string): Promise<void> {
        const deletedUnit = await this.productUnitRepository.delete(id);
        if (!deletedUnit) {
            throw new NotFoundException('Product unit not found');
        }
    }
}
