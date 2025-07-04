import { CookieOptions } from 'express';
import ENV from './env.util';

const cookieOptionDefault = {
  httpOnly: true,
  secure: ENV.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

export const getCookieOptions = (expires: Date): CookieOptions => ({
  ...cookieOptionDefault,
  expires,
});
