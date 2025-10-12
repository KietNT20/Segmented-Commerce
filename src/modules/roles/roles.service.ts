import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly rolesRepository: Repository<Role>,
    ) {}

    create(createRoleInput: CreateRoleInput): Promise<Role> {
        const role = this.rolesRepository.create(createRoleInput);
        return this.rolesRepository.save(role);
    }

    findAll(): Promise<Role[]> {
        return this.rolesRepository.find();
    }

    findOne(id: string): Promise<Role | null> {
        return this.rolesRepository.findOneBy({ id });
    }

    update(id: string, updateRoleInput: UpdateRoleInput): Promise<Role | null> {
        return this.rolesRepository.save({ ...updateRoleInput, id });
    }

    async remove(id: string): Promise<void> {
        await this.rolesRepository.delete(id);
    }
}
