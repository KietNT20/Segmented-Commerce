import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Gender } from '../enums/gender.enum';

@ObjectType()
@Entity()
export class User {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String)
    @Index({ unique: true })
    @Column('varchar', { length: 255, unique: true })
    email: string;

    @Field(() => String)
    @Exclude()
    @Column('varchar', { length: 150 })
    password: string;

    @Field(() => String)
    @Column('varchar', { length: 255, name: 'first_name' })
    firstName: string;

    @Field(() => String)
    @Column('varchar', { length: 255, name: 'last_name' })
    lastName: string;

    @Field(() => String, { nullable: true })
    @Index({ unique: true })
    @Column('varchar', {
        nullable: true,
        length: 11,
        unique: true,
        name: 'phone_number',
    })
    phone?: string;

    @Field(() => Gender, { nullable: true })
    @Column({ type: 'enum', enum: Gender, nullable: true })
    gender?: Gender;

    @Field(() => String, { nullable: true })
    @Column('varchar', { nullable: true, name: 'refresh_token' })
    @Exclude()
    refreshToken?: string;

    @Field(() => GraphQLISODateTime, { nullable: true })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Field(() => GraphQLISODateTime, { nullable: true })
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Field(() => GraphQLISODateTime, { nullable: true })
    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @Field(() => Customer)
    @OneToOne(() => Customer, (customer) => customer.user, {
        cascade: true,
    })
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @Field(() => [Role])
    @ManyToMany(() => Role)
    @JoinTable({
        name: 'user_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    userRoles: Role[];
}
