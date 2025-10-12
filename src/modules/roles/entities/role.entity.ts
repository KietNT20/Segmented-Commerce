import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Permission } from 'src/modules/permissions/entities/permission.etity';
import { User } from 'src/modules/users/entities/user.entity';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Role {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String)
    @Column('varchar', { length: 100, unique: true, name: 'role_name' })
    roleName: string;

    @Field(() => [Permission])
    @ManyToMany(() => Permission, (permission) => permission.roles, {
        cascade: true,
    })
    @JoinTable({
        name: 'role_permissions',
        joinColumn: { name: 'role_id', referencedColumnName: 'id' },
        inverseJoinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id',
        },
    })
    permissions: Permission[];

    @ManyToMany(() => User, (user) => user.userRoles)
    users: User[];
}
