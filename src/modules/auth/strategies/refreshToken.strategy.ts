import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';
import { JwtPayload } from '../interfaces/jwt.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(
        private readonly usersService: UsersService,
        configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>(
                'JWT_REFRESH_SECRET',
            ) as string,
            passReqToCallback: true,
        });
    }

    async validate(payload: JwtPayload) {
        const authUser = await this.usersService.findOne(payload.sub);
        if (!authUser) {
            throw new UnauthorizedException();
        }
        return {
            attributes: authUser,
        };
    }
}
