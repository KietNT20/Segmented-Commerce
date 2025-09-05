import { registerEnumType } from '@nestjs/graphql';

export enum Role {
    ADMIN = 'admin',
    CUSTOMER = 'customer',
}

export enum Gender {
    MALE = 'M',
    FEMALE = 'F',
}

// Register enums with GraphQL
registerEnumType(Role, {
    name: 'Role',
    description: 'User role enum',
});

registerEnumType(Gender, {
    name: 'Gender',
    description: 'User gender enum',
});
