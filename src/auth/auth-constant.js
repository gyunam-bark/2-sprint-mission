import ENV from '../config/env.js';

export const AUTH_STRINGS = {
  ACCESS_TOKEN: 'access-token',
  REFRESH_TOKEN: 'refresh-token',
};

export const COOKIE_OPTIONS = {
  SECURE: {
    WHEN_PRODUCTION: ENV.NODE_ENV === 'production',
  },
  SAME_SITE: {
    STRICT: 'strict',
  },
};

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
