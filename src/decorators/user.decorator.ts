import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext<{ req: { user: User } }>().req.user;
    },
);
