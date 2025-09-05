import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersResolver } from './customers.resolver';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Customer])],
    providers: [CustomersResolver, CustomersService],
    exports: [CustomersService],
})
export class CustomersModule {}
