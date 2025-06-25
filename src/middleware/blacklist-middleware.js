import { getCookie } from 'hono/cookie';
import redis from '../redis/redis.js';
import { AUTH_STRINGS, REDIS_GET } from '../auth/auth-constant.js';
import { HttpError } from '../util/error-util.js';

// AccessToken 이 비활성화 되면 Redis 에 블랙리스트를 고정한다.
export const checkBlacklistToken = async (c, next) => {
  try {
    const accessToken = getCookie(c, AUTH_STRINGS.ACCESS_TOKEN);
    if (!accessToken) {
      throw new HttpError(401, '로그인이 필요합니다.');
    }

    const isBlacklisted = await redis.get(REDIS_GET.KEY(accessToken));
    if (isBlacklisted) {
      throw new HttpError(401, '로그아웃된 토큰입니다.');
    }

    await next();
  } catch (error) {
    throw error;
  }
};
