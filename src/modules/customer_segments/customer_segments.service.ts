import { Injectable } from '@nestjs/common';
import { CreateCustomerSegmentInput } from './dto/create-customer_segment.input';
import { UpdateCustomerSegmentInput } from './dto/update-customer_segment.input';

@Injectable()
export class CustomerSegmentsService {
    create(createCustomerSegmentInput: CreateCustomerSegmentInput) {
        return 'This action adds a new customerSegment';
    }

    findAll() {
        return `This action returns all customerSegments`;
    }

    findOne(id: number) {
        return `This action returns a #${id} customerSegment`;
    }

    update(id: number, updateCustomerSegmentInput: UpdateCustomerSegmentInput) {
        return `This action updates a #${id} customerSegment`;
    }

    remove(id: number) {
        return `This action removes a #${id} customerSegment`;
    }
}
