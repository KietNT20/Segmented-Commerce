import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/login.input';
import { LoginOutput } from './dto/login.output';
import { SignupInput } from './dto/signup.input';
import { JwtPayload } from './interfaces/jwt.interface';
import { HashingProvider } from './providers/hashing.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly hashingProvider: HashingProvider,
    private readonly configService: ConfigService,
  ) {}

  async login(loginInput: LoginInput): Promise<LoginOutput> {
    const user = await this.validateUser(loginInput.email, loginInput.password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      full_name: `${user.firstName} ${user.lastName}`,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async registerUser(signupInput: SignupInput): Promise<User> {
    const createdUser = await this.usersService.create(signupInput);

    return createdUser;
  }

  async refreshToken(oldRefreshToken: string) {
    const user = await this.usersService.findByRefreshToken(oldRefreshToken);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      full_name: `${user.firstName} ${user.lastName}`,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET') as string,
      expiresIn: this.configService.get('JWT_EXPIRES_IN') as string,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET') as string,
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') as string,
    });

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);

      const authenticated = await this.hashingProvider.comparePassword(
        password,
        user?.password as string,
      );

      if (!authenticated) {
        throw new UnauthorizedException();
      }

      return user;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
