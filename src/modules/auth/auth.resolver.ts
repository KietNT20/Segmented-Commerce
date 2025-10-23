import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/decorators/user.decorator';
import { GqlAuthGuard } from 'src/guards/jwt-auth.guard';
import { GqlLocalAuthGuard } from 'src/guards/local-auth.guard';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { LoginOutput } from './dto/login.output';
import { SignupInput } from './dto/signup.input';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(GqlLocalAuthGuard)
    @Mutation(() => LoginOutput)
    async signin(@CurrentUser() user: User, @Args('loginInput') _: LoginInput) {
        return this.authService.loginUser(user);
    }

    @Mutation(() => User)
    async signup(@Args('signupInput') signupInput: SignupInput) {
        return this.authService.registerUser(signupInput);
    }

    @Mutation(() => LoginOutput)
    async refreshToken(@Args('refreshToken') refreshToken: string) {
        return this.authService.refreshToken(refreshToken);
    }

    @Query(() => User)
    @UseGuards(GqlAuthGuard)
    me(@CurrentUser() user: User) {
        return user;
    }
}
