# Sơ đồ Hệ thống Phân quyền

## Kiến trúc tổng thể

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      USER       │    │      ROLE       │    │   PERMISSION    │
│                 │    │                 │    │                 │
│ - id: string    │    │ - id: string    │    │ - id: string    │
│ - email: string │◄──►│ - roleName: str │◄──►│ - resource: enum│
│ - userRoles: [] │    │ - permissions:[]│    │ - action: []    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              Many-to-Many              Many-to-Many
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │    RESOURCE     │
                    │                 │
                    │ - USERS         │
                    │ - CUSTOMERS     │
                    │ - PRODUCTS      │
                    │ - ROLES         │
                    │ - SETTINGS      │
                    └─────────────────┘
```

## Luồng xử lý Authorization

```
1. User Request
   ↓
2. JWT Authentication (GqlAuthGuard)
   ↓ (Success)
3. Permission Check (PermissionGuard)
   ↓
4. Get User Roles from JWT
   ↓
5. Query User Permissions from Database
   ↓
6. Check Required Permission vs User Permissions
   ↓
7. Allow/Deny Access
```

## Ví dụ Permission Matrix

| Role    | Resource  | CREATE | READ | UPDATE | DELETE |
| ------- | --------- | ------ | ---- | ------ | ------ |
| ADMIN   | USERS     | ✅     | ✅   | ✅     | ✅     |
| ADMIN   | CUSTOMERS | ✅     | ✅   | ✅     | ✅     |
| ADMIN   | PRODUCTS  | ✅     | ✅   | ✅     | ✅     |
| MANAGER | USERS     | ❌     | ✅   | ❌     | ❌     |
| MANAGER | CUSTOMERS | ✅     | ✅   | ✅     | ❌     |
| MANAGER | PRODUCTS  | ❌     | ✅   | ❌     | ❌     |
| SALES   | USERS     | ❌     | ❌   | ❌     | ❌     |
| SALES   | CUSTOMERS | ✅     | ✅   | ✅     | ❌     |
| SALES   | PRODUCTS  | ❌     | ✅   | ❌     | ❌     |

## Decorator Usage Examples

### 1. Basic Permission Check

```typescript
@RequirePermission(Resource.USERS, Action.CREATE)
createUser() { ... }
```

### 2. Any Permission (OR Logic)

```typescript
@RequireAnyPermission([
    { resource: Resource.USERS, action: Action.UPDATE },
    { resource: Resource.USERS, action: Action.DELETE }
])
updateOrDeleteUser() { ... }
```

### 3. All Permissions (AND Logic)

```typescript
@RequireAllPermissions([
    { resource: Resource.USERS, action: Action.READ },
    { resource: Resource.ROLES, action: Action.READ }
])
viewUsersWithRoles() { ... }
```

## Database Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY,
    role_name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Permissions table
CREATE TABLE permissions (
    id UUID PRIMARY KEY,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(20)[] NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User-Role relationship
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id),
    role_id UUID REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);

-- Role-Permission relationship
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id),
    permission_id UUID REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);
```

## JWT Token Structure

```typescript
interface JwtPayload {
    email: string;
    sub: string; // user ID
    full_name: string;
    role_ids: string[]; // Array of role IDs
}
```

## Permission Check Flow

```typescript
// 1. Extract permission requirement from decorator
const requirement = this.reflector.get(PERMISSION_KEY, context.getHandler());

// 2. Get user from JWT context
const user = this.getUserFromContext(context);

// 3. Query user permissions from database
const userPermissions = await this.permissionsService.getUserPermissions(
    user.id,
);

// 4. Check if user has required permission
const hasPermission = userPermissions.some(
    (permission) =>
        permission.resource === requirement.resource &&
        permission.action.includes(requirement.action),
);

// 5. Allow or deny access
if (!hasPermission) {
    throw new ForbiddenException('Insufficient permissions');
}
```
