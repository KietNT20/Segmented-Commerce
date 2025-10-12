import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.etity';
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
            relations: ['permissions'],
        });
    }

    findOne(id: string): Promise<Role | null> {
        return this.rolesRepository.findOne({
            where: { id },
            relations: ['permissions'],
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
                relations: ['permissions'],
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
}
