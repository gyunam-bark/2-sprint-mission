import { RequestHandler } from 'express';
import { getAccessToken } from '../utils/token.util';
import { UnauthorizedError } from '../types/error.type';
import { findTokenInBlacklist } from '../utils/redis.util';

export const checkBlacklist: RequestHandler = async (req, res, next): Promise<void> => {
  const accessToken = getAccessToken(req);
  if (!accessToken) {
    throw new UnauthorizedError();
  }

  const blacklistedToken = await findTokenInBlacklist(accessToken);
  if (blacklistedToken) {
    throw new UnauthorizedError();
  }

  return next();
};
