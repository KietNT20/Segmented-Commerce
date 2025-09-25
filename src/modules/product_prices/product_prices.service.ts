import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Paginated } from '../pagination/interface/paginated.interface';
import { CreateProductPriceInput } from './dto/create-product_price.input';
import { QueryProductPriceInput } from './dto/query-product_price.input';
import { UpdateProductPriceInput } from './dto/update-product_price.input';
import { ProductPrice } from './entities/product_price.entity';

@Injectable()
export class ProductPricesService {
    constructor(
        @InjectRepository(ProductPrice)
        private productPriceRepository: Repository<ProductPrice>,
    ) {}

    async create(
        createProductPriceInput: CreateProductPriceInput,
    ): Promise<ProductPrice> {
        const productPrice = this.productPriceRepository.create(
            createProductPriceInput,
        );
        return this.productPriceRepository.save(productPrice);
    }

    async findAll(
        queryProductPriceInput: QueryProductPriceInput,
    ): Promise<Paginated<ProductPrice>> {
        const { minPrice, maxPrice, offset, limit, sortOrder } =
            queryProductPriceInput;

        const [productPrices, total] =
            await this.productPriceRepository.findAndCount({
                where: {
                    finalPrice: Between(minPrice, maxPrice),
                },
                skip: offset,
                take: limit,
                order: {
                    finalPrice: sortOrder,
                },
                relations: {
                    customerSegment: true,
                },
            });

        return {
            data: productPrices,
            meta: {
                totalItems: total,
                totalPages: Math.ceil(total / (limit ?? 10)),
                currentPage: Math.floor((offset ?? 0) / (limit ?? 10)) + 1,
                itemsPerPage: limit ?? 10,
            },
        };
    }

    async findOne(id: string): Promise<ProductPrice> {
        const productPrice = await this.productPriceRepository.findOne({
            where: { id },
        });
        if (!productPrice) {
            throw new NotFoundException('Product price not found');
        }
        return productPrice;
    }

    async update(
        id: string,
        updateProductPriceInput: UpdateProductPriceInput,
    ): Promise<ProductPrice> {
        const productPrice = await this.productPriceRepository.findOne({
            where: { id },
        });
        if (!productPrice) {
            throw new NotFoundException('Product price not found');
        }

        const updatedProductPrice = this.productPriceRepository.merge(
            productPrice,
            updateProductPriceInput,
        );

        return this.productPriceRepository.save(updatedProductPrice);
    }

    async remove(id: string): Promise<void> {
        const productPrice = await this.productPriceRepository.findOne({
            where: { id },
        });
        if (!productPrice) {
            throw new NotFoundException('Product price not found');
        }
        await this.productPriceRepository.remove(productPrice);
    }
}
