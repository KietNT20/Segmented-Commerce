import {
    Field,
    Float,
    GraphQLISODateTime,
    ID,
    Int,
    ObjectType,
} from '@nestjs/graphql';
import { ProductPrice } from 'src/modules/product_prices/entities/product_price.entity';
import { ProductUnit } from 'src/modules/product_unit/entities/product_unit.entity';
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
export class Product {
    @Field(() => ID, { description: 'Product ID' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String, { description: 'Product name' })
    @Column({ unique: true, name: 'product_name' })
    productName: string;

    @Field(() => String, { description: 'Product description' })
    @Column('text', { nullable: true })
    description?: string;

    @Field(() => String, { description: 'Product SKU' })
    @Column({ unique: true })
    sku: string;

    @Field(() => Float, { description: 'Product base price' })
    @Column('numeric', { precision: 15, scale: 0, name: 'base_price' })
    basePrice: number;

    @Field(() => Int, { description: 'Product stock quantity' })
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

    @Field(() => [ProductUnit])
    @OneToMany(() => ProductUnit, (unit) => unit.product, { cascade: true })
    units: ProductUnit[];

    @Field(() => [ProductPrice])
    @OneToMany(() => ProductPrice, (price) => price.product, { cascade: true })
    prices: ProductPrice[];
}
