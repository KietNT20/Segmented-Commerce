import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreatePermissionInput } from './create-permission.input';

@InputType()
export class UpdatePermissionInput extends PartialType(CreatePermissionInput) {
    @Field(() => ID)
    id: string;
}
