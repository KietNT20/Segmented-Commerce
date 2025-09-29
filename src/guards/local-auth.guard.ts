import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class GqlLocalAuthGuard extends AuthGuard('local') {
    getRequest(context: ExecutionContext): Request {
        const gqlExecutionContext = GqlExecutionContext.create(context);
        const gqlContext = gqlExecutionContext.getContext<{ req: Request }>();
        const gqlArgs: Record<string, unknown> = gqlExecutionContext.getArgs();
        gqlContext.req.body = {
            ...(gqlContext.req.body as Record<string, unknown>),
            ...gqlArgs,
        };
        return gqlContext.req;
    }
}
