import { RequestHandler } from 'express';
import { ForbiddenError, UnauthorizedError } from '../types/error.type';
import { setUser } from '../utils/user.util';
import { USER_ROLE } from '../enums/user.enum';
import { getAccessToken, verifyAccessToken } from '../utils/token.util';

export const allow = (roles: USER_ROLE[]): RequestHandler => {
  return async (req, res, next) => {
    // NONE
    if (roles.includes(USER_ROLE.NONE)) {
      return next();
    }

    const accessToken = getAccessToken(req);

    // PUBLIC
    if (accessToken === undefined) {
      if (roles.includes(USER_ROLE.PUBLIC)) {
        return next();
      }
      throw new UnauthorizedError();
    }

    const payload = verifyAccessToken(accessToken);

    setUser(req, payload);

    const isMaster = payload.role === USER_ROLE.MASTER;

    // USER
    if (roles.includes(USER_ROLE.USER) || isMaster) {
      return next();
    }

    // MASTER
    if (roles.includes(USER_ROLE.MASTER) && isMaster) {
      return next();
    }

    throw new ForbiddenError();
  };
};
