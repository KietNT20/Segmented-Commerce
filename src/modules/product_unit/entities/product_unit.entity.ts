import {
    Field,
    Float,
    GraphQLISODateTime,
    ID,
    ObjectType,
} from '@nestjs/graphql';
import { Product } from 'src/modules/products/entities/product.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class ProductUnit {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String, {
        description: 'Unit name (thùng, hộp, kg, lon, ...)',
    })
    @Column('varchar', { length: 32, name: 'unit_name' })
    unitName: string;

    @Field(() => Float, { description: 'Price per unit' })
    @Column('numeric', { precision: 15, scale: 0 })
    price: number;

    @Field(() => Float, {
        description:
            'Tỷ lệ quy đổi so với đơn vị cơ bản (vd: 1 thùng = 24 lon)',
    })
    @Column('float', { name: 'conversion_rate', default: 1 })
    conversionRate: number;

    @Field(() => Float, { description: 'Số lượng tồn kho theo đơn vị này' })
    @Column('int', { name: 'stock_quantity' })
    stockQuantity: number;

    @Field(() => GraphQLISODateTime, { nullable: true })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Field(() => GraphQLISODateTime, { nullable: true })
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Field(() => GraphQLISODateTime, { nullable: true })
    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @Field(() => Product)
    @ManyToOne(() => Product, (product) => product.units)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}
