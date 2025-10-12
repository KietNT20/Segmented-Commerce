import { Field, ID, InputType } from '@nestjs/graphql';
import { ArrayMinSize, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateRoleInput {
    @Field(() => String)
    @IsString()
    roleName: string;

    @Field(() => [ID])
    @IsUUID('4', { each: true })
    @ArrayMinSize(1)
    permissionIds: string[];
}
