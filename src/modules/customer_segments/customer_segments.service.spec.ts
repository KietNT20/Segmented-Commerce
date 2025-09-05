import { Test, TestingModule } from '@nestjs/testing';
import { CustomerSegmentsService } from './customer_segments.service';

describe('CustomerSegmentsService', () => {
    let service: CustomerSegmentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CustomerSegmentsService],
        }).compile();

        service = module.get<CustomerSegmentsService>(CustomerSegmentsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
