import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { Permission } from '../../permissions/entities/permission.etity';

@InputType()
export class CreateRoleInput {
    @Field(() => String)
    @IsString()
    roleName: string;

    @Field(() => [Permission])
    @ValidateNested()
    @Type(() => Permission)
    permissionIds: Permission[];
}
