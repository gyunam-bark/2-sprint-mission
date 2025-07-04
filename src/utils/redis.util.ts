import Redis from 'ioredis';
import { getTokenRemainSeconds } from './token.util';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

export const REDIS_SET = {
  KEY: (token: string) => `bl_${token}`,
  VALUE: {
    BLACKLIST: 'blacklisted',
  },
  SECONDS_TOKEN: 'EX' as const,
  SECONDS: (seconds: number) => seconds,
};

export const REDIS_GET = {
  KEY: (token: string) => `bl_${token}`,
};

export const addTokenToBlacklist = async (token: string) => {
  const expirySeconds = getTokenRemainSeconds(token);

  await redis.set(
    REDIS_SET.KEY(token),
    REDIS_SET.VALUE.BLACKLIST,
    REDIS_SET.SECONDS_TOKEN,
    REDIS_SET.SECONDS(expirySeconds)
  );
};

export const findTokenInBlacklist = async (token: string) => await redis.get(REDIS_GET.KEY(token));
