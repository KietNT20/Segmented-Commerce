import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerSegmentsResolver } from './customer_segments.resolver';
import { CustomerSegmentsService } from './customer_segments.service';
import { CustomerSegment } from './entities/customer_segment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerSegment])],
  providers: [CustomerSegmentsResolver, CustomerSegmentsService],
  exports: [CustomerSegmentsService],
})
export class CustomerSegmentsModule {}
