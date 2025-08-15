import { Role } from 'src/modules/users/enums';

export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  role: Role;
}
