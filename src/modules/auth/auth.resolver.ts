import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/decorators/user.decorator';
import { GqlAuthGuard } from 'src/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { LoginOutput } from './dto/login.output';
import { SignupInput } from './dto/signup.input';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => LoginOutput)
    async signin(@Args('signinInput') signinInput: LoginInput) {
        return this.authService.loginUser(signinInput);
    }

    @Mutation(() => User)
    async signup(@Args('signupInput') signupInput: SignupInput) {
        return this.authService.registerUser(signupInput);
    }

    @Mutation(() => LoginOutput)
    async refreshToken(@Args('refreshToken') refreshToken: string) {
        return this.authService.refreshToken(refreshToken);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => User)
    me(@CurrentUser() user: User) {
        return this.authService.getUserInfo(user.id);
    }
}
