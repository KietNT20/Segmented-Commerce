import {
    Field,
    Float,
    GraphQLISODateTime,
    ID,
    ObjectType,
} from '@nestjs/graphql';
import { CustomerSegment } from 'src/modules/customer_segments/entities/customer_segment.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class ProductPrice {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => Float, { description: 'Phần trăm giảm giá cho phân khúc này' })
    @Column('float', { name: 'discount_percentage', default: 0 })
    discountPercentage: number;

    @Field(() => Float, { description: 'Giá cuối cùng cho phân khúc này' })
    @Column('numeric', { name: 'final_price', precision: 15, scale: 0 })
    finalPrice: number;

    @Field(() => GraphQLISODateTime, { nullable: true })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Field(() => GraphQLISODateTime, { nullable: true })
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Field(() => Product)
    @ManyToOne(() => Product, (product) => product.prices, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Field(() => CustomerSegment)
    @ManyToOne(() => CustomerSegment, (segment) => segment.prices, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'customer_segment_id' })
    customerSegment: CustomerSegment;
}
