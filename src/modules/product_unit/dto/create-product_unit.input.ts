import { Field, Float, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductUnitInput {
    @Field(() => String, {
        description: 'Unit name (thùng, hộp, kg, lon, ...)',
    })
    unitName: string;

    @Field(() => Float, { description: 'Price per unit' })
    price: number;

    @Field(() => Float, {
        description:
            'Tỷ lệ quy đổi so với đơn vị cơ bản (vd: 1 thùng = 24 lon)',
        defaultValue: 1,
    })
    conversionRate: number;

    @Field(() => Int, { description: 'Số lượng tồn kho theo đơn vị này' })
    stockQuantity: number;

    @Field(() => ID, { description: 'Associated product ID' })
    productId: string;
}
