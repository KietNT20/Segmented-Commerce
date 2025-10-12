import { registerEnumType } from '@nestjs/graphql';

export enum Action {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
}

registerEnumType(Action, {
    name: 'Action',
    description: 'Action enum for access control',
});
