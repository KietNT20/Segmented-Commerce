import { SetMetadata } from '@nestjs/common';
import { Action, Resource } from '../modules/roles/enums';

export interface PermissionRequirement {
    resource?: Resource;
    action?: Action;
    anyOf?: Array<{ resource: Resource; action: Action }>;
    allOf?: Array<{ resource: Resource; action: Action }>;
}

export const PERMISSION_KEY = 'permission';

/**
 * Decorator để yêu cầu quyền cụ thể trên resource
 * @param resource - Tài nguyên cần kiểm tra quyền
 * @param action - Hành động cần kiểm tra (CREATE, READ, UPDATE, DELETE)
 *
 * @example
 * @RequirePermission(Resource.USERS, Action.CREATE)
 * createUser() { ... }
 */
export const RequirePermission = (resource: Resource, action: Action) =>
    SetMetadata(PERMISSION_KEY, { resource, action });

/**
 * Decorator để yêu cầu nhiều quyền (user chỉ cần có 1 trong các quyền)
 * @param permissions - Mảng các quyền cần kiểm tra
 *
 * @example
 * @RequireAnyPermission([
 *   { resource: Resource.USERS, action: Action.UPDATE },
 *   { resource: Resource.USERS, action: Action.DELETE }
 * ])
 * updateOrDeleteUser() { ... }
 */
export const RequireAnyPermission = (
    permissions: Array<{ resource: Resource; action: Action }>,
) => SetMetadata(PERMISSION_KEY, { anyOf: permissions });

/**
 * Decorator để yêu cầu tất cả các quyền (user phải có tất cả quyền)
 * @param permissions - Mảng các quyền cần kiểm tra
 *
 * @example
 * @RequireAllPermissions([
 *   { resource: Resource.USERS, action: Action.READ },
 *   { resource: Resource.ROLES, action: Action.READ }
 * ])
 * viewUserAndRoles() { ... }
 */
export const RequireAllPermissions = (
    permissions: Array<{ resource: Resource; action: Action }>,
) => SetMetadata(PERMISSION_KEY, { allOf: permissions });
