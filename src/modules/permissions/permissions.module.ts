import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.etity';
import { PermissionsResolver } from './permissions.resolver';
import { PermissionsService } from './permissions.service';

@Module({
    imports: [TypeOrmModule.forFeature([Permission])],
    providers: [PermissionsResolver, PermissionsService],
    exports: [PermissionsService],
})
export class PermissionsModule {}
