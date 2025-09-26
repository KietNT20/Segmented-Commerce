import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateProductInput {
    @Field(() => String, { description: 'Product name' })
    @IsString()
    productName: string;

    @Field(() => String, { nullable: true, description: 'Product description' })
    @IsOptional()
    @IsString()
    description?: string;

    @Field(() => String, { description: 'Product SKU' })
    @IsString()
    sku: string;

    @Field(() => Float, { description: 'Product base price' })
    @IsNumber()
    @IsPositive()
    basePrice: number;

    @Field(() => Int, { description: 'Product stock quantity' })
    @IsNumber()
    @IsPositive()
    stockQuantity: number;
}
