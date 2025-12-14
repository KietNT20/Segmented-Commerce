import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    RequireAllPermissions,
    RequirePermission,
} from 'src/decorators/permission.decorator';
import { Public } from 'src/decorators/public.decorator';
import { GqlAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { Role } from './entities/role.entity';
import { Action, Resource } from './enums';
import { RolesService } from './roles.service';

@UseGuards(GqlAuthGuard, PermissionGuard)
@Resolver(() => Role)
export class RolesResolver {
    constructor(private readonly rolesService: RolesService) {}

    @Mutation(() => Role)
    @RequirePermission(Resource.ROLES, Action.CREATE)
    createRole(@Args('createRoleInput') createRoleInput: CreateRoleInput) {
        return this.rolesService.create(createRoleInput);
    }

    @Query(() => [Role], { name: 'roles' })
    @RequirePermission(Resource.ROLES, Action.READ)
    findAll() {
        return this.rolesService.findAll();
    }

    @Query(() => Role, { name: 'role' })
    @RequirePermission(Resource.ROLES, Action.READ)
    findOne(@Args('id', { type: () => ID }) id: string) {
        return this.rolesService.findOne(id);
    }

    @Mutation(() => Role)
    @RequirePermission(Resource.ROLES, Action.UPDATE)
    updateRole(@Args('updateRoleInput') updateRoleInput: UpdateRoleInput) {
        return this.rolesService.update(updateRoleInput.id, updateRoleInput);
    }

    @Mutation(() => Role)
    @RequirePermission(Resource.ROLES, Action.DELETE)
    removeRole(@Args('id', { type: () => ID }) id: string) {
        return this.rolesService.remove(id);
    }

    @Mutation(() => Role)
    @Public()
    createAdminRole(): Promise<Role> {
        return this.rolesService.createAdminRole();
    }

    @Query(() => [Role], { name: 'rolesWithUsers' })
    @RequireAllPermissions([
        { resource: Resource.ROLES, action: Action.READ },
        { resource: Resource.USERS, action: Action.READ },
    ])
    findRolesWithUsers(): Promise<Role[]> {
        return this.rolesService.findAllWithUsers();
    }

    @Mutation(() => Role)
    @RequirePermission(Resource.ROLES, Action.UPDATE)
    assignRoleToUser(
        @Args('roleId', { type: () => ID }) roleId: string,
        @Args('userId', { type: () => ID }) userId: string,
    ): Promise<Role> {
        return this.rolesService.assignRoleToUser(roleId, userId);
    }

    @Mutation(() => Role)
    @RequirePermission(Resource.ROLES, Action.UPDATE)
    removeRoleFromUser(
        @Args('roleId', { type: () => ID }) roleId: string,
        @Args('userId', { type: () => ID }) userId: string,
    ): Promise<Role> {
        return this.rolesService.removeRoleFromUser(roleId, userId);
    }
}
