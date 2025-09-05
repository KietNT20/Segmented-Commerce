import { Role } from 'src/modules/users/enums';

export interface JwtPayload {
    sub: string;
    full_name: string;
    email: string;
    role: Role;
}
