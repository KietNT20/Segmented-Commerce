import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { BcryptProvider } from './providers/bcrypt.provider';
import { HashingProvider } from './providers/hashing.provider';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtRefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
    imports: [PassportModule, JwtModule, UsersModule],
    providers: [
        AuthResolver,
        AuthService,
        {
            provide: HashingProvider,
            useClass: BcryptProvider,
        },
        JwtStrategy,
        JwtRefreshTokenStrategy,
        LocalStrategy,
    ],
    exports: [AuthService],
})
export class AuthModule {}
