import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { ProductPrice } from 'src/modules/product_prices/entities/product_price.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class CustomerSegment {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String)
    @Column({ unique: true, length: 32, name: 'customer_segment_code' })
    customerSegmentCode: string;

    @Field(() => String)
    @Column({ unique: true, length: 255 })
    name: string;

    @Field(() => String, { nullable: true })
    @Column('varchar', { length: 500, nullable: true })
    description?: string;

    @Field(() => GraphQLISODateTime, { nullable: true })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Field(() => GraphQLISODateTime, { nullable: true })
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Field(() => GraphQLISODateTime, { nullable: true })
    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @Field(() => [ProductPrice])
    @OneToMany(() => ProductPrice, (price) => price.customerSegment, {
        cascade: true,
    })
    prices: ProductPrice[];

    @Field(() => [Customer])
    @OneToMany(() => Customer, (customer) => customer.segment)
    customers: Customer[];
}
