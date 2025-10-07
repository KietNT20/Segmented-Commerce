import { Role } from 'src/modules/users/enums';

export interface JwtPayload {
    sub: string;
    full_name: string;
    email: string;
    role: Role;
}

export type JwtWithRefreshToken = JwtPayload & {
    refresh_token: string;
};

export interface JwtDecoded extends JwtPayload {
    iat: number;
    exp: number;
}
