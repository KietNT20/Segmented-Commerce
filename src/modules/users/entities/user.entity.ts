import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender, Role } from '../enums';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ length: 255, unique: true })
  email: string;

  @Field(() => String)
  @Exclude()
  @Column('varchar', { length: 150 })
  password: string;

  @Field(() => String)
  @Column({ length: 255, name: 'first_name' })
  firstName: string;

  @Field(() => String)
  @Column({ length: 255, name: 'last_name' })
  lastName: string;

  @Field(() => String)
  @Column({ length: 11, unique: true, name: 'phone_number' })
  phone: string;

  @Field(() => Gender, { nullable: true })
  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: Gender;

  @Field(() => String)
  @Column({ nullable: true, name: 'refresh_token' })
  @Exclude()
  refreshToken?: string;

  @Field(() => Role)
  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToOne(() => Customer, (customer) => customer.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;
}
