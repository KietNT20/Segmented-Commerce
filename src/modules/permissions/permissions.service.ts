import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { Permission } from './entities/permission.etity';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ) {}

    create(createPermissionInput: CreatePermissionInput): Promise<Permission> {
        const permission = this.permissionRepository.create(
            createPermissionInput,
        );
        return this.permissionRepository.save(permission);
    }

    findAll(): Promise<Permission[]> {
        return this.permissionRepository.find();
    }

    findOne(id: string): Promise<Permission | null> {
        return this.permissionRepository.findOneBy({ id });
    }

    async update(
        id: string,
        updatePermissionInput: UpdatePermissionInput,
    ): Promise<Permission | null> {
        const havingPermission = await this.permissionRepository.findOneBy({
            id,
        });

        if (!havingPermission) {
            throw new NotFoundException(`Permission with id ${id} not found`);
        }

        const updatedPermission = this.permissionRepository.merge(
            havingPermission,
            updatePermissionInput,
        );

        return this.permissionRepository.save(updatedPermission);
    }

    async remove(id: string): Promise<Permission | null> {
        const havingPermission = await this.permissionRepository.findOneBy({
            id,
        });

        if (!havingPermission) {
            throw new NotFoundException(`Permission with id ${id} not found`);
        }

        return this.permissionRepository.remove(havingPermission);
    }
}
