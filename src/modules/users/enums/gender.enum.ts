import { registerEnumType } from '@nestjs/graphql';

export enum Gender {
    MALE = 'M',
    FEMALE = 'F',
}

registerEnumType(Gender, {
    name: 'Gender',
    description: 'User gender enum',
});
