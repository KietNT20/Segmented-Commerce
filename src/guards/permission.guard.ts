import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
    PERMISSION_KEY,
    PermissionRequirement,
} from '../decorators/permission.decorator';
import { PermissionsService } from '../modules/permissions/permissions.service';
import { Action, Resource } from '../modules/roles/enums';
import { User } from '../modules/users/entities/user.entity';

interface GraphQLRequest {
    user?: User;
}

interface HttpRequest {
    user?: User;
}

@Injectable()
export class PermissionGuard implements CanActivate {
    private readonly logger = new Logger(PermissionGuard.name);

    constructor(
        private readonly reflector: Reflector,
        private readonly permissionsService: PermissionsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const permissionRequirement = this.reflector.get<PermissionRequirement>(
            PERMISSION_KEY,
            context.getHandler(),
        );

        // If no permission requirement, allow access
        if (!permissionRequirement) {
            return true;
        }

        // Get user from context (GraphQL or HTTP)
        const user = this.getUserFromContext(context);
        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        // Admin role bypass: Admin có full access tự động với mọi resource và action
        // Không cần check permissions trong database, kể cả với resource mới được thêm sau này
        const userIsAdmin = await this.permissionsService.isAdmin(user);
        if (userIsAdmin) {
            return true;
        }

        // Check permission
        const hasPermission = await this.checkPermission(
            user,
            permissionRequirement,
        );

        if (!hasPermission) {
            this.logger.warn(
                `User ${user.email} denied access to resource with requirement: ${JSON.stringify(permissionRequirement)}`,
            );
            throw new ForbiddenException('Insufficient permissions');
        }

        return true;
    }

    private getUserFromContext(context: ExecutionContext): User | null {
        // Handle GraphQL context
        if (context.getType<string>() === 'graphql') {
            const gqlContext = GqlExecutionContext.create(context);
            const contextData = gqlContext.getContext<{
                req?: GraphQLRequest;
            }>();
            const request = contextData.req;
            return request?.user || null;
        }

        // Handle HTTP context
        const request = context.switchToHttp().getRequest<HttpRequest>();
        return request?.user || null;
    }

    private async checkPermission(
        user: User,
        requirement: PermissionRequirement,
    ): Promise<boolean> {
        try {
            // Get all permissions of user
            const userPermissions =
                await this.permissionsService.getUserPermissions(user.id);

            // Check single permission
            if (requirement.resource && requirement.action) {
                return this.hasSpecificPermission(
                    userPermissions,
                    requirement.resource,
                    requirement.action,
                );
            }

            // Check "any of" permission (only need one of the permissions)
            if (
                'anyOf' in requirement &&
                requirement.anyOf &&
                Array.isArray(requirement.anyOf) &&
                requirement.anyOf.length > 0
            ) {
                return requirement.anyOf.some((perm) =>
                    this.hasSpecificPermission(
                        userPermissions,
                        perm.resource,
                        perm.action,
                    ),
                );
            }

            // Check "all of" permission (must have all permissions)
            if (
                'allOf' in requirement &&
                requirement.allOf &&
                Array.isArray(requirement.allOf) &&
                requirement.allOf.length > 0
            ) {
                return requirement.allOf.every((perm) =>
                    this.hasSpecificPermission(
                        userPermissions,
                        perm.resource,
                        perm.action,
                    ),
                );
            }

            return false;
        } catch (error) {
            this.logger.error('Error checking permissions:', error);
            return false;
        }
    }

    private hasSpecificPermission(
        userPermissions: Array<{ resource: Resource; action: Action[] }>,
        resource: Resource,
        action: Action,
    ): boolean {
        return userPermissions.some((permission) => {
            return (
                permission.resource === resource &&
                permission.action.includes(action)
            );
        });
    }
}
