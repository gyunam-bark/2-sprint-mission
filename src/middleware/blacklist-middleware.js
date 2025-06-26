import { getCookie } from 'hono/cookie';
import { AUTH_STRINGS } from '../auth/auth-constant.js';
import { HttpError } from '../util/error-util.js';
import { findAccessTokenInBlacklist } from '../util/redis-util.js';

export const checkBlacklistToken = async (c, next) => {
  try {
    const accessToken = getCookie(c, AUTH_STRINGS.ACCESS_TOKEN);
    if (!accessToken) {
      throw new HttpError(401, '로그인이 필요합니다.');
    }

    if (await findAccessTokenInBlacklist(accessToken)) {
      throw new HttpError(401, '로그아웃된 토큰입니다.');
    }

    await next();
  } catch (error) {
    throw error;
  }
};
