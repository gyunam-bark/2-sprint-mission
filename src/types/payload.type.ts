import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from '../enums/user.enum';

export type Payload = JwtPayload & {
  id: string;
  role: USER_ROLE;
};
