import USER_ROLE from '../common/user-role.js';
import { HttpError } from '../util/error-util.js';
import { getAccessToken, verifyAccessToken } from '../util/token-util.js';
import { setUser } from '../util/user-util.js';

// ===========================================
// = MIDDLEWARE
// ===========================================
export const allow = (roles) => {
  return async (c, next) => {
    try {
      const accessToken = getAccessToken(c);

      // PUBLIC
      if (!accessToken) {
        if (roles.includes(USER_ROLE.PUBLIC)) {
          return await next();
        }
        throw new HttpError(401, '로그인이 필요합니다.');
      }

      const payload = verifyAccessToken(accessToken);

      const isMaster = payload.role === USER_ROLE.MASTER;

      await setUser(c, payload);

      // USER
      if (roles.includes(USER_ROLE.USER) || isMaster) {
        return await next();
      }

      // MASTER
      if (roles.includes(USER_ROLE.MASTER) && isMaster) {
        return await next();
      }

      throw new HttpError(403, '권한이 없습니다.');
    } catch (error) {
      throw error;
    }
  };
};
