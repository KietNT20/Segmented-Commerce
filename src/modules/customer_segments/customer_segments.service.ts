import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    Paginated,
    SortOrder,
} from '../pagination/interface/paginated.interface';
import { CreateCustomerSegmentInput } from './dto/create-customer_segment.input';
import { QueryCustomerSegmentInput } from './dto/query-customer_segment.input';
import { UpdateCustomerSegmentInput } from './dto/update-customer_segment.input';
import { CustomerSegment } from './entities/customer_segment.entity';

@Injectable()
export class CustomerSegmentsService {
    constructor(
        @InjectRepository(CustomerSegment)
        private readonly customerSegmentRepository: Repository<CustomerSegment>,
    ) {}

    async create(
        createCustomerSegmentInput: CreateCustomerSegmentInput,
    ): Promise<CustomerSegment> {
        const customerSegment = this.customerSegmentRepository.create(
            createCustomerSegmentInput,
        );
        return await this.customerSegmentRepository.save(customerSegment);
    }

    async findAll(
        queryCustomerSegmentInput: QueryCustomerSegmentInput,
    ): Promise<Paginated<CustomerSegment>> {
        const {
            customerSegmentCode,
            name,
            limit = 10,
            offset = 0,
            sortOrder = SortOrder.DESC,
        } = queryCustomerSegmentInput;

        const [customerSegments, totalCount] =
            await this.customerSegmentRepository.findAndCount({
                where: {
                    ...(customerSegmentCode && { customerSegmentCode }),
                    ...(name && { name }),
                },
                order: {
                    createdAt: sortOrder,
                },
                take: limit,
                skip: offset,
            });

        return {
            data: customerSegments,
            meta: {
                currentPage: Math.floor(offset / limit) + 1,
                itemsPerPage: limit,
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        };
    }

    findOne(id: string): Promise<CustomerSegment | null> {
        return this.customerSegmentRepository.findOneBy({ id });
    }

    async update(
        id: string,
        updateCustomerSegmentInput: UpdateCustomerSegmentInput,
    ): Promise<CustomerSegment> {
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

    async remove(id: string): Promise<void> {
        const customerSegment = await this.customerSegmentRepository.findOneBy({
            id,
        });

        if (!customerSegment) {
            throw new NotFoundException('Customer segment not found');
        }
        await this.customerSegmentRepository.delete(id);
    }
}
