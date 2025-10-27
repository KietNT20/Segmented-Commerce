import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RequirePermission } from 'src/decorators/permission.decorator';
import { Action, Resource } from '../roles/enums';
import { CreateUserInput } from './dto/create-user.input';
import { PaginatedUser, QueryUserInput } from './dto/query-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
// @UseGuards(GqlAuthGuard, PermissionGuard)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @Mutation(() => User)
    // @RequirePermission(Resource.USERS, Action.CREATE)
    createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
        return this.usersService.create(createUserInput);
    }

    @Query(() => PaginatedUser, { name: 'users' })
    // @RequirePermission(Resource.USERS, Action.READ)
    findAll(
        @Args('queryUserInput', { type: () => QueryUserInput })
        queryUserInput: QueryUserInput,
    ) {
        return this.usersService.findAll(queryUserInput);
    }

    @Query(() => User, { name: 'user' })
    // @RequirePermission(Resource.USERS, Action.READ)
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.usersService.findOne(id);
    }

    @Mutation(() => User)
    @RequirePermission(Resource.USERS, Action.UPDATE)
    updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
        return this.usersService.update(updateUserInput.id, updateUserInput);
    }

    @Mutation(() => User)
    @RequirePermission(Resource.USERS, Action.DELETE)
    removeUser(@Args('id', { type: () => String }) id: string) {
        return this.usersService.remove(id);
    }
}
