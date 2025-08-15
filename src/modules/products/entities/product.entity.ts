import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { CustomerSegment } from 'src/modules/customer_segments/entities/customer_segment.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
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

  @Field(() => String, { description: 'Product image' })
  @Column({ nullable: true })
  image?: string;

  @Field(() => Float, { description: 'Product base price' })
  @Column('numeric', { precision: 15, scale: 0, name: 'base_price' })
  basePrice: number;

  @Field(() => Float, { description: 'Product final price' })
  @Column('numeric', { precision: 15, scale: 0, name: 'final_price' })
  finalPrice: number;

  @Field(() => Float, { description: 'Product discount percentage' })
  @Column('float', { name: 'discount_percentage' })
  discountPercentage: number;

  @Field(() => Float, { description: 'Product stock quantity' })
  @Column('int', { name: 'stock_quantity' })
  stockQuantity: number;

  @Field(() => Boolean, { description: 'Product is active' })
  @Column('boolean', { name: 'is_active' })
  isActive: boolean;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => Date)
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToMany(() => CustomerSegment, (segment) => segment.products)
  @JoinTable({
    name: 'product_prices',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'segment_id',
      referencedColumnName: 'id',
    },
  })
  segments: CustomerSegment[];
}
