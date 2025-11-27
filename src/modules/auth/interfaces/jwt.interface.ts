import { JwtPayload } from 'jwt-decode';

export interface JwtInfo extends JwtPayload {
    email: string;
}
