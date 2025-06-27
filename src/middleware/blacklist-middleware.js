import { getCookie } from 'hono/cookie';
import { AUTH_STRINGS } from '../auth/auth-constant.js';
import { UnauthorizedError } from '../util/error-util.js';
import { findAccessTokenInBlacklist } from '../util/redis-util.js';

export const checkBlacklistToken = async (c, next) => {
  try {
    const accessToken = getCookie(c, AUTH_STRINGS.ACCESS_TOKEN);
    if (!accessToken) {
      throw new UnauthorizedError();
    }

    if (await findAccessTokenInBlacklist(accessToken)) {
      throw new UnauthorizedError();
    }

    await next();
  } catch (error) {
    throw error;
  }
};
