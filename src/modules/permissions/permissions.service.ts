import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ADMIN_ROLE_NAME } from '../roles/constants/role.constants';
import { Action, Resource } from '../roles/enums';
import { User } from '../users/entities/user.entity';
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
     * Tạo permissions cho admin role - full access to all resources and actions
     * Method này đảm bảo admin luôn có quyền với mọi resource hiện tại và tương lai
     * @returns Mảng permissions với tất cả resources và actions
     */
    private getAdminPermissions(): Array<{
        resource: Resource;
        action: Action[];
    }> {
        const allResources = Object.values(Resource);
        const allActions = Object.values(Action);

        return allResources.map((resource) => ({
            resource,
            action: allActions,
        }));
    }

    /**
     * Kiểm tra user có role admin không
     * Admin role được phân biệt bằng roleName === ADMIN_ROLE_NAME
     * Admin không cần permissions trong database vì có full access tự động
     * @param user - User entity hoặc userId
     * @returns true nếu user có role admin
     */
    async isAdmin(user: User | string): Promise<boolean> {
        if (typeof user === 'string') {
            const userEntity = await this.permissionRepository.manager
                .getRepository(User)
                .findOne({
                    where: { id: user },
                    relations: { userRoles: true },
                });

            if (!userEntity) {
                return false;
            }

            return userEntity.userRoles.some(
                (role) => role.roleName === ADMIN_ROLE_NAME,
            );
        }

        if (!user.userRoles) {
            const userEntity = await this.permissionRepository.manager
                .getRepository(User)
                .findOne({
                    where: { id: user.id },
                    relations: { userRoles: true },
                });

            if (!userEntity) {
                return false;
            }

            return userEntity.userRoles.some(
                (role) => role.roleName === ADMIN_ROLE_NAME,
            );
        }

        return user.userRoles.some((role) => role.roleName === ADMIN_ROLE_NAME);
    }

    /**
     * Lấy tất cả quyền của user thông qua các role
     * Admin role: Trả về full permissions cho tất cả resources và actions (tự động bao gồm resource mới)
     * Other roles: Trả về permissions được gán trong database
     * @param userId - ID của user
     * @returns Mảng các quyền với resource và action
     */
    async getUserPermissions(
        userId: string,
    ): Promise<Array<{ resource: Resource; action: Action[] }>> {
        const user = await this.permissionRepository.manager
            .getRepository(User)
            .findOne({
                where: { id: userId },
                relations: { userRoles: true },
            });

        if (!user) {
            return [];
        }

        const userIsAdmin = await this.isAdmin(user);

        if (userIsAdmin) {
            return this.getAdminPermissions();
        }

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
     * Admin role: Luôn trả về true (full access)
     * Other roles: Kiểm tra permissions trong database
     * @param userId - ID của user
     * @param resource - Resource cần kiểm tra (có thể là resource mới)
     * @param action - Action cần kiểm tra
     * @returns true nếu có quyền, false nếu không
     */
    async hasPermission(
        userId: string,
        resource: Resource,
        action: Action,
    ): Promise<boolean> {
        const userIsAdmin = await this.isAdmin(userId);

        if (userIsAdmin) {
            return true;
        }

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
