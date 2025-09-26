import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateCustomerSegmentInput {
    @Field(() => String, { description: 'Name of the customer segment' })
    @IsString()
    name: string;

    @Field(() => String, {
        description: 'Description of the customer segment',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    description?: string;
}
