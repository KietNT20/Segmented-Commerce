import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SortOrder } from '../pagination/interface/paginated.interface';
import { CreateCustomerInput } from './dto/create-customer.input';
import {
    PaginatedCustomer,
    QueryCustomerInput,
} from './dto/query-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private customersRepository: Repository<Customer>,
    ) {}

    create(createCustomerInput: CreateCustomerInput): Promise<Customer> {
        return this.customersRepository.save(createCustomerInput);
    }

    async findAll(
        queryCustomerInput: QueryCustomerInput,
    ): Promise<PaginatedCustomer> {
        const {
            offset = 0,
            limit = 10,
            sortOrder = SortOrder.DESC,
        } = queryCustomerInput;

        const [customers, total] = await this.customersRepository.findAndCount({
            skip: offset,
            take: limit,
            order: {
                createdAt: sortOrder,
            },
            where: {
                customerCode: queryCustomerInput.customerCode,
                companyName: queryCustomerInput.companyName,
                address: queryCustomerInput.address,
                city: queryCustomerInput.city,
            },
            relations: {
                segment: true,
                user: true,
            },
        });

        return {
            data: customers,
            meta: {
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                currentPage: offset,
                itemsPerPage: limit,
            },
        };
    }

    findOne(id: string): Promise<Customer | null> {
        return this.customersRepository.findOneBy({ id });
    }

    async update(
        id: string,
        updateCustomerInput: UpdateCustomerInput,
    ): Promise<Customer> {
        const customer = await this.customersRepository.findOneBy({ id });

        if (!customer) {
            throw new NotFoundException('Customer not found');
        }

        const updatedCustomer = this.customersRepository.merge(
            customer,
            updateCustomerInput,
        );

        return this.customersRepository.save(updatedCustomer);
    }

    async softRemove(id: string): Promise<void> {
        const customer = await this.customersRepository.findOneBy({ id });

        if (!customer) {
            throw new NotFoundException('Customer not found');
        }

        await this.customersRepository.softDelete(id);
    }

    async remove(id: string): Promise<void> {
        const customer = await this.customersRepository.findOneBy({ id });

        if (!customer) {
            throw new NotFoundException('Customer not found');
        }

        await this.customersRepository.delete(id);
    }
}
