import redis from '../redis/redis.js';
import { getAccessTokenRemainSeconds } from './token-util.js';

export const REDIS_SET = {
  KEY: (token) => `bl_${token}`,
  VALUE: {
    BLACKLIST: 'balcklisted',
  },
  SECONDS_TOKEN: 'EX',
  SECONDS: (seconds) => seconds,
};

export const REDIS_GET = {
  KEY: (token) => `bl_${token}`,
};

export const addAccessTokenToBlacklist = async (token) => {
  const expirySeconds = getAccessTokenRemainSeconds(token);

  await redis.set(
    REDIS_SET.KEY(token),
    REDIS_SET.VALUE.BLACKLIST,
    REDIS_SET.SECONDS_TOKEN,
    REDIS_SET.SECONDS(expirySeconds)
  );
};

export const findAccessTokenInBlacklist = async (token) => await redis.get(REDIS_GET.KEY(token));
