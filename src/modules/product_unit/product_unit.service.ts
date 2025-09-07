import { Injectable } from '@nestjs/common';
import { CreateProductUnitInput } from './dto/create-product_unit.input';
import { UpdateProductUnitInput } from './dto/update-product_unit.input';

@Injectable()
export class ProductUnitService {
    create(createProductUnitInput: CreateProductUnitInput) {
        return 'This action adds a new productUnit';
    }

    findAll() {
        return `This action returns all productUnit`;
    }

    findOne(id: number) {
        return `This action returns a #${id} productUnit`;
    }

    update(id: number, updateProductUnitInput: UpdateProductUnitInput) {
        return `This action updates a #${id} productUnit`;
    }

    remove(id: number) {
        return `This action removes a #${id} productUnit`;
    }
}
