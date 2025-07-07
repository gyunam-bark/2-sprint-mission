import jwt from 'jsonwebtoken';
import HTTP_STATUSES from '../common/http.status.mjs';
import USER_ROLES from '../user/user.role.mjs';

const SECRET_KEY = process.env.SECRET_KEY;

export const setAllowedRole = (roles = []) => {
  return (req, res, next) => {
    // 띄어쓰기 있으면 없앰.
    // 토큰이 여러개 들어있으면 안 되지만?
    // 있으면 첫번째 꺼 사용
    const token = req.headers.authorization?.split(' ')[1];

    // PUBLIC 은 토큰이 없어야 가능
    // 사용자 생성, 이미지 다운로드
    if (!token) {
      if (roles.includes(USER_ROLES.PUBLIC)) { return next(); }
      return res.status(HTTP_STATUSES.FAIL_UNAUTHORIZED_401).json({ message: 'no token provided' });
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;

      const isMaster = (decoded.role === USER_ROLES.MASTER);
      const isOwner = (req.params.id === decoded.id);

      // OWNER 일 때
      // MASTER 는 뭐던 들어갈 수 있음
      if (roles.includes(USER_ROLES.OWNER) && (isMaster || isOwner)) {
        return next();
      }

      // USER 일 때
      // MASTER 는 뭐던 들어갈 수 있음
      if (roles.includes(USER_ROLES.USER) || isMaster) {
        return next();
      }

      // MASTER 일 때
      if (roles.includes(USER_ROLES.MASTER) && isMaster) {
        return next();
      }

      return res.status(HTTP_STATUSES.FAIL_FORBIDDEN_403).json({ message: 'access denied' });

    } catch (error) {
      return res.status(HTTP_STATUSES.FAIL_UNAUTHORIZED_401).json({ message: 'invalid or expired token' });
    }
  };
};