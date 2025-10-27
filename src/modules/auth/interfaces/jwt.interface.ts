import { JwtPayload } from 'jwt-decode';

export interface JwtInfo extends JwtPayload {
    email: string;
    user_roles: string[];
}

export type JwtWithRefreshToken = JwtInfo & {
    refresh_token: string;
};
