import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action, Resource } from '../roles/enums';
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
            throw new NotFoundException('Permission not found');
        }

        const updatedPermission = this.permissionRepository.merge(
            havingPermission,
            updatePermissionInput,
        );

        return this.permissionRepository.save(updatedPermission);
    }

    async remove(id: string): Promise<void> {
        const deletedPermission = await this.permissionRepository.delete(id);
        if (!deletedPermission) {
            throw new NotFoundException('Permission not found');
        }
    }

    /**
     * Lấy tất cả quyền của user thông qua các role
     * @param userId - ID của user
     * @returns Mảng các quyền với resource và action
     */
    async getUserPermissions(
        userId: string,
    ): Promise<Array<{ resource: Resource; action: Action[] }>> {
        const permissions = await this.permissionRepository
            .createQueryBuilder('permission')
            .innerJoin('permission.roles', 'role')
            .innerJoin('role.users', 'user')
            .where('user.id = :userId', { userId })
            .select(['permission.resource', 'permission.action'])
            .getMany();

        return permissions.map((permission) => ({
            resource: permission.resource,
            action: permission.action,
        }));
    }

    /**
     * Kiểm tra user có quyền cụ thể trên resource không
     * @param userId - ID của user
     * @param resource - Resource cần kiểm tra
     * @param action - Action cần kiểm tra
     * @returns true nếu có quyền, false nếu không
     */
    async hasPermission(
        userId: string,
        resource: Resource,
        action: Action,
    ): Promise<boolean> {
        const userPermissions = await this.getUserPermissions(userId);

        return userPermissions.some(
            (permission) =>
                permission.resource === resource &&
                permission.action.includes(action),
        );
    }

    /**
     * Lấy tất cả quyền của user được nhóm theo resource
     * @param userId - ID của user
     * @returns Object với key là resource và value là array actions
     */
    async getUserPermissionsGrouped(
        userId: string,
    ): Promise<Record<Resource, Action[]>> {
        const permissions = await this.getUserPermissions(userId);

        const grouped: Record<string, Action[]> = {};

        permissions.forEach((permission) => {
            if (!grouped[permission.resource]) {
                grouped[permission.resource] = [];
            }
            // Merge actions và loại bỏ duplicate
            grouped[permission.resource] = [
                ...new Set([
                    ...grouped[permission.resource],
                    ...permission.action,
                ]),
            ];
        });

        return grouped as Record<Resource, Action[]>;
    }
}
