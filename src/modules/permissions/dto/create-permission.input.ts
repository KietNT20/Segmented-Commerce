import { Field, InputType } from '@nestjs/graphql';
import { ArrayUnique, IsEnum } from 'class-validator';
import { Action, Resource } from 'src/modules/roles/enums';

@InputType()
export class CreatePermissionInput {
    @Field(() => Resource)
    @IsEnum(Resource)
    resource: Resource;

    @Field(() => [Action])
    @IsEnum(Action, { each: true })
    @ArrayUnique()
    action: Action[];
}
