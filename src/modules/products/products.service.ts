import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SortOrder } from '../pagination/interface/paginated.interface';
import { CreateProductInput } from './dto/create-product.input';
import { PaginatedProduct, QueryProductInput } from './dto/query-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
    ) {}

    create(createProductInput: CreateProductInput): Promise<Product> {
        const product = this.productsRepository.create(createProductInput);
        return this.productsRepository.save(product);
    }

    async findAll(
        queryProductInput: QueryProductInput,
    ): Promise<PaginatedProduct> {
        const {
            productName,
            productSKU,
            limit = 10,
            offset = 0,
            sortOrder = SortOrder.DESC,
        } = queryProductInput;

        const [products, total] = await this.productsRepository.findAndCount({
            where: {
                ...(productName && { productName }),
                ...(productSKU && { productSKU }),
            },
            order: {
                createdAt: sortOrder,
            },
            skip: offset,
            take: limit,
        });

        return {
            data: products,
            meta: {
                currentPage: Math.floor(offset / limit) + 1,
                itemsPerPage: limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    findOne(id: string): Promise<Product | null> {
        return this.productsRepository.findOneBy({ id });
    }

    async update(
        id: string,
        updateProductInput: UpdateProductInput,
    ): Promise<Product> {
        const product = await this.productsRepository.findOneBy({ id });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const updatedProduct = this.productsRepository.merge(
            product,
            updateProductInput,
        );

        if (!updatedProduct) {
            throw new NotFoundException('Product not found');
        }

        return await this.productsRepository.save(updatedProduct);
    }

    async remove(id: string): Promise<void> {
        const deletedProduct = await this.productsRepository.delete(id);

        if (!deletedProduct) {
            throw new NotFoundException('Product not found');
        }
    }
}
