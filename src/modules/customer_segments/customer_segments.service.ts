import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCustomerSegmentInput } from './dto/create-customer_segment.input';
import { UpdateCustomerSegmentInput } from './dto/update-customer_segment.input';
import { CustomerSegment } from './entities/customer_segment.entity';

@Injectable()
export class CustomerSegmentsService {
    constructor(
        private readonly customerSegmentRepository: Repository<CustomerSegment>,
    ) {}

    create(createCustomerSegmentInput: CreateCustomerSegmentInput) {
        const customerSegment = this.customerSegmentRepository.create(
            createCustomerSegmentInput,
        );
        return this.customerSegmentRepository.save(customerSegment);
    }

    findAll() {
        return this.customerSegmentRepository.find();
    }

    findOne(id: string) {
        return this.customerSegmentRepository.findOneBy({ id });
    }

    async update(
        id: string,
        updateCustomerSegmentInput: UpdateCustomerSegmentInput,
    ) {
        const customerSegment = await this.customerSegmentRepository.findOneBy({
            id,
        });

        if (!customerSegment) {
            throw new NotFoundException('Customer segment not found');
        }

        this.customerSegmentRepository.merge(
            customerSegment,
            updateCustomerSegmentInput,
        );
        return this.customerSegmentRepository.save(customerSegment);
    }

    remove(id: string) {
        return this.customerSegmentRepository.delete(id);
    }
}
