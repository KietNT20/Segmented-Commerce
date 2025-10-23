import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../permissions/entities/permission.etity';
import { PermissionsModule } from '../permissions/permissions.module';
import { User } from '../users/entities/user.entity';
import { Role } from './entities/role.entity';
import { RolesResolver } from './roles.resolver';
import { RolesService } from './roles.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Role, Permission, User]),
        PermissionsModule,
    ],
    providers: [RolesResolver, RolesService],
    exports: [RolesService],
})
export class RolesModule {}
