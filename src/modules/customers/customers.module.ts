import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../permissions/permissions.module';
import { CustomersResolver } from './customers.resolver';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Customer]), PermissionsModule],
    providers: [CustomersResolver, CustomersService],
    exports: [CustomersService],
})
export class CustomersModule {}
