import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductPriceInput {
    @Field(() => Int, { description: 'Phần trăm giảm giá cho phân khúc này' })
    discountPercentage: number;

    @Field(() => Int, { description: 'Giá cuối cùng cho phân khúc này' })
    finalPrice: number;

    @Field(() => String, { description: 'ID của sản phẩm' })
    productId: string;

    @Field(() => String, { description: 'ID của phân khúc khách hàng' })
    customerSegmentId: string;
}
