import { Module } from '@nestjs/common';
import { CustomerSegmentsService } from './customer_segments.service';
import { CustomerSegmentsResolver } from './customer_segments.resolver';

@Module({
  providers: [CustomerSegmentsResolver, CustomerSegmentsService],
})
export class CustomerSegmentsModule {}
