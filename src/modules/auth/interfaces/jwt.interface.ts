export interface JwtPayload {
    sub: string;
    full_name: string;
    email: string;
    role_ids: string[];
}

export type JwtWithRefreshToken = JwtPayload & {
    refresh_token: string;
};

export interface JwtDecoded extends JwtPayload {
    iat: number;
    exp: number;
}
