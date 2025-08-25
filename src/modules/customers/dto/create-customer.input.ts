import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateCustomerInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  companyName?: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  customerCode: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  address: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  city: string;

  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  customerSegmentId: string;
}
