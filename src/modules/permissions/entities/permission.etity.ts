import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Action, Resource } from 'src/modules/roles/enums';
import { Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export class Permission {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => Resource)
    @Column('enum', { enum: Resource })
    resource: Resource;

    @Field(() => [Action])
    @Column('enum', { enum: Action, array: true })
    action: Action[];

    @ManyToMany(() => Role, (role) => role.permissions)
    roles: Role[];
}
