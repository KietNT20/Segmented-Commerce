import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { CustomerSegment } from 'src/modules/customer_segments/entities/customer_segment.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Customer {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ length: 255, nullable: true, name: 'company_name' })
  companyName?: string;

  @Field(() => String)
  @Column({ length: 255 })
  address: string;

  @Field(() => String)
  @Column({ length: 255 })
  city: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => CustomerSegment, (segment) => segment.customers)
  @JoinColumn({ name: 'segment_id' })
  segment: CustomerSegment;

  @OneToOne(() => User, (user) => user.customer)
  user: User;
}
