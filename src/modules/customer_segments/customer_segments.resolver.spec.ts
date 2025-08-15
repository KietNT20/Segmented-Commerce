import { Test, TestingModule } from '@nestjs/testing';
import { CustomerSegmentsResolver } from './customer_segments.resolver';
import { CustomerSegmentsService } from './customer_segments.service';

describe('CustomerSegmentsResolver', () => {
  let resolver: CustomerSegmentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerSegmentsResolver, CustomerSegmentsService],
    }).compile();

    resolver = module.get<CustomerSegmentsResolver>(CustomerSegmentsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
