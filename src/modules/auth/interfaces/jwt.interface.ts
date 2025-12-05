import { JwtPayload } from 'jwt-decode';

export interface JwtAccessToken extends JwtPayload {
    email: string;
}
