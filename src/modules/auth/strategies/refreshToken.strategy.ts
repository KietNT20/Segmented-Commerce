import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jwt-decode';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_REFRESH_SECRET as string,
            passReqToCallback: true,
        });
    }

    async validate(payload: JwtPayload) {
        const authUser = await this.usersService.findOne(payload.sub!);

        if (!authUser) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        return {
            attributes: authUser,
        };
    }
}
