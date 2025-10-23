import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginOutput } from './dto/login.output';
import { SignupInput } from './dto/signup.input';
import { JwtPayload } from './interfaces/jwt.interface';
import { HashingProvider } from './providers/hashing.provider';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
        private readonly hashingProvider: HashingProvider,
        private readonly configService: ConfigService,
    ) {}

    async loginUser(user: User): Promise<LoginOutput> {
        const validatedUser = await this.validateUser(
            user.email,
            user.password,
        );

        const payload: JwtPayload = {
            email: validatedUser!.email,
            sub: validatedUser!.id,
            full_name: `${validatedUser!.firstName} ${validatedUser!.lastName}`,
            role_ids: validatedUser!.userRoles.map((role) => role.id),
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
        });

        await this.usersService.updateRefreshToken(
            validatedUser!.id,
            refreshToken,
        );

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    async registerUser(signupInput: SignupInput): Promise<User> {
        const createdUser = await this.usersService.create({
            ...signupInput,
            userRoleIds: signupInput.roleIds,
            gender: undefined,
        });

        return createdUser;
    }

    async refreshToken(oldRefreshToken: string) {
        const user =
            await this.usersService.findByRefreshToken(oldRefreshToken);

        if (!user) {
            throw new UnauthorizedException();
        }

        const payload: JwtPayload = {
            email: user.email,
            sub: user.id,
            full_name: `${user.firstName} ${user.lastName}`,
            role_ids: user.userRoles.map((role) => role.id),
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
        });

        await this.usersService.updateRefreshToken(user.id, refreshToken);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);

        const authenticated = await this.hashingProvider.comparePassword(
            password,
            user?.password as string,
        );

        if (!authenticated) {
            throw new UnauthorizedException('Email or password is invalid');
        }

        return user;
    }

    verifyToken(token: string) {
        try {
            const decoded = this.jwtService.verify<JwtPayload>(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
            return decoded;
        } catch (error) {
            this.logger.error(error);
            throw new UnauthorizedException('Invalid token');
        }
    }
}
