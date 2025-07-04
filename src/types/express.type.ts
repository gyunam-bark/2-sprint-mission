import { Payload } from './payload.type';
import { Validated } from './validated.type';

declare global {
  namespace Express {
    interface Request {
      validated: Validated;
      user?: Payload;
    }
  }
}
