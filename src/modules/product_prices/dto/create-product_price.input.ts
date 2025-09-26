import { Field, Float, InputType } from '@nestjs/graphql';
import { IsNumber, IsPositive, IsString, Min } from 'class-validator';

@InputType()
export class CreateProductPriceInput {
    @Field(() => Float, { description: 'Phần trăm giảm giá cho phân khúc này' })
    @IsNumber()
    @IsPositive()
    discountPercentage: number;

    @Field(() => Float, { description: 'Giá cuối cùng cho phân khúc này' })
    @IsNumber()
    @Min(0)
    finalPrice: number;

    @Field(() => String, { description: 'ID của sản phẩm' })
    @IsString()
    productId: string;

    @Field(() => String, { description: 'ID của phân khúc khách hàng' })
    @IsString()
    customerSegmentId: string;
}
