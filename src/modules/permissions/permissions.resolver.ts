import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RequirePermission } from 'src/decorators/permission.decorator';
import { GqlAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { Action, Resource } from '../roles/enums';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { Permission } from './entities/permission.etity';
import { PermissionsService } from './permissions.service';

@UseGuards(GqlAuthGuard, PermissionGuard)
@Resolver(() => Permission)
export class PermissionsResolver {
    constructor(private readonly permissionsService: PermissionsService) {}

    @Mutation(() => Permission)
    @RequirePermission(Resource.PERMISSIONS, Action.CREATE)
    createPermission(
        @Args('createPermissionInput')
        createPermissionInput: CreatePermissionInput,
    ) {
        return this.permissionsService.create(createPermissionInput);
    }

    @Query(() => [Permission], { name: 'permissions' })
    @RequirePermission(Resource.PERMISSIONS, Action.READ)
    findAll() {
        return this.permissionsService.findAll();
    }

    @Query(() => Permission, { name: 'permission' })
    @RequirePermission(Resource.PERMISSIONS, Action.READ)
    findOne(@Args('id', { type: () => ID }) id: string) {
        return this.permissionsService.findOne(id);
    }

    @Mutation(() => Permission)
    @RequirePermission(Resource.PERMISSIONS, Action.UPDATE)
    updatePermission(
        @Args('updatePermissionInput')
        updatePermissionInput: UpdatePermissionInput,
    ) {
        return this.permissionsService.update(
            updatePermissionInput.id,
            updatePermissionInput,
        );
    }

    @Mutation(() => Permission)
    @RequirePermission(Resource.PERMISSIONS, Action.DELETE)
    removePermission(@Args('id', { type: () => ID }) id: string) {
        return this.permissionsService.remove(id);
    }
}
