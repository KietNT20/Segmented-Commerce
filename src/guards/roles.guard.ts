import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/modules/roles/entities/role.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles =
            this.reflector.get(Roles, context.getHandler()) ||
            this.reflector.get(Roles, context.getClass());

        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user as User;

        const hasRole = roles.some((roleName: string) =>
            user.userRoles.some(
                (userRole: Role) => userRole.roleName === roleName,
            ),
        );

        if (!hasRole) {
            throw new ForbiddenException(
                `Access denied. Required roles: ${roles.join(', ')}`,
            );
        }

        return true;
    }
}
