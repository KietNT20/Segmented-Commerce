import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { Permission } from './entities/permission.etity';
import { PermissionsService } from './permissions.service';

@Resolver(() => Permission)
export class PermissionsResolver {
    constructor(private readonly permissionsService: PermissionsService) {}

    @Mutation(() => Permission)
    createPermission(
        @Args('createPermissionInput')
        createPermissionInput: CreatePermissionInput,
    ) {
        return this.permissionsService.create(createPermissionInput);
    }

    @Query(() => [Permission], { name: 'permissions' })
    findAll() {
        return this.permissionsService.findAll();
    }

    @Query(() => Permission, { name: 'permission' })
    findOne(@Args('id', { type: () => ID }) id: string) {
        return this.permissionsService.findOne(id);
    }

    @Mutation(() => Permission)
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
    removePermission(@Args('id', { type: () => ID }) id: string) {
        return this.permissionsService.remove(id);
    }
}
