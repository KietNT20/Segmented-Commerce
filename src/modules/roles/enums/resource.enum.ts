import { registerEnumType } from '@nestjs/graphql';

export enum Resource {
    USERS = 'users',
    ROLES = 'roles',
    CUSTOMERS = 'customers',
    CUSTOMER_SEGMENTS = 'customer_segments',
    PRODUCTS = 'products',
    PRODUCT_PRICES = 'product_prices',
    PRODUCT_UNITS = 'product_units',
    SETTINGS = 'settings',
}

registerEnumType(Resource, {
    name: 'Resource',
    description: 'Resource enum for access control',
});
