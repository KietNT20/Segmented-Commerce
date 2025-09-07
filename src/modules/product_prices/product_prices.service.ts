import { Injectable } from '@nestjs/common';
import { CreateProductPriceInput } from './dto/create-product_price.input';
import { UpdateProductPriceInput } from './dto/update-product_price.input';

@Injectable()
export class ProductPricesService {
    create(createProductPriceInput: CreateProductPriceInput) {
        return 'This action adds a new productPrice';
    }

    findAll() {
        return `This action returns all productPrices`;
    }

    findOne(id: number) {
        return `This action returns a #${id} productPrice`;
    }

    update(id: number, updateProductPriceInput: UpdateProductPriceInput) {
        return `This action updates a #${id} productPrice`;
    }

    remove(id: number) {
        return `This action removes a #${id} productPrice`;
    }
}
