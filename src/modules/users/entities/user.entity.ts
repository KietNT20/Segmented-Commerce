import { Field, ID, ObjectType } from '@nestjs/graphql';
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
import { Role } from '../enums';

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
  @Column({ length: 255 })
  password: string;

  @Field(() => String)
  @Column({ length: 255, name: 'first_name' })
  firstName: string;

  @Field(() => String)
  @Column({ length: 255, name: 'last_name' })
  lastName: string;

  @Field(() => String)
  @Column({ length: 255 })
  phone: string;

  @Field(() => Role)
  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => Date)
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToOne(() => Customer, (customer) => customer.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;
}
