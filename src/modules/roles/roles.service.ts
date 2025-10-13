import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.etity';
import { User } from '../users/entities/user.entity';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly rolesRepository: Repository<Role>,
        @InjectRepository(Permission)
        private readonly permissionsRepository: Repository<Permission>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async create(createRoleInput: CreateRoleInput): Promise<Role> {
        const { permissionIds, ...roleData } = createRoleInput;

        const permissions = await this.permissionsRepository.findBy({
            id: In(permissionIds),
        });

        const role = this.rolesRepository.create({
            ...roleData,
            permissions,
        });

        return this.rolesRepository.save(role);
    }

    findAll(): Promise<Role[]> {
        return this.rolesRepository.find({
            relations: {
                permissions: true,
            },
        });
    }

    findOne(id: string): Promise<Role | null> {
        return this.rolesRepository.findOne({
            where: { id },
            relations: {
                permissions: true,
            },
        });
    }

    async update(
        id: string,
        updateRoleInput: UpdateRoleInput,
    ): Promise<Role | null> {
        const { permissionIds, ...roleData } = updateRoleInput;

        if (permissionIds) {
            const permissions = await this.permissionsRepository.findBy({
                id: In(permissionIds),
            });

            await this.rolesRepository.update(id, roleData);

            const role = await this.rolesRepository.findOne({
                where: { id },
                relations: {
                    permissions: true,
                },
            });

            if (role) {
                role.permissions = permissions;
                return this.rolesRepository.save(role);
            }
        } else {
            await this.rolesRepository.update(id, roleData);
            return this.rolesRepository.findOneBy({ id });
        }

        return null;
    }

    async remove(id: string): Promise<void> {
        await this.rolesRepository.delete(id);
    }

    /**
     * Find all roles with their associated users
     * @returns Array of roles with users
     */
    async findAllWithUsers(): Promise<Role[]> {
        return this.rolesRepository.find({
            relations: {
                permissions: true,
                users: true,
            },
        });
    }

    /**
     * Assign a role to a user
     * @param roleId - ID of the role
     * @param userId - ID of the user
     * @returns The updated role
     */
    async assignRoleToUser(roleId: string, userId: string): Promise<Role> {
        const role = await this.rolesRepository.findOne({
            where: { id: roleId },
            relations: {
                users: true,
            },
        });

        if (!role) {
            throw new NotFoundException(`Role with id ${roleId} not found`);
        }

        const user = await this.usersRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`User with id ${userId} not found`);
        }

        // Check if user already has this role
        const userAlreadyHasRole = role.users.some(
            (existingUser) => existingUser.id === userId,
        );

        if (!userAlreadyHasRole) {
            role.users.push(user);
            return this.rolesRepository.save(role);
        }

        return role;
    }

    /**
     * Remove a role from a user
     * @param roleId - ID of the role
     * @param userId - ID of the user
     * @returns The updated role
     */
    async removeRoleFromUser(roleId: string, userId: string): Promise<Role> {
        const role = await this.rolesRepository.findOne({
            where: { id: roleId },
            relations: {
                users: true,
            },
        });

        if (!role) {
            throw new NotFoundException(`Role with id ${roleId} not found`);
        }

        // Remove user from role
        role.users = role.users.filter((user) => user.id !== userId);
        return this.rolesRepository.save(role);
    }
}
