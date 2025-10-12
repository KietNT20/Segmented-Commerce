import { registerEnumType } from '@nestjs/graphql';

export enum Resource {
    USERS = 'users',
    ROLES = 'roles',
    CUSTOMERS = 'customers',
    BUSINESSES = 'businesses',
    PRODUCTS = 'products',
    SETTINGS = 'settings',
}

registerEnumType(Resource, {
    name: 'Resource',
    description: 'Resource enum for access control',
});
