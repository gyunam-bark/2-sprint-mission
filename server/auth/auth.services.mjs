import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import database from '../database/prisma.client.mjs';
import HTTP_STATUSES from '../common/http.status.mjs';
import * as COMMON_DEFAULTS from '../common/common.default.mjs';
import { errorWithStatus } from '../util/error.util.mjs';

const SECRET_KEY = process.env.SECRET_KEY;

export const login = async (body = {}, ip = '') => {
  const {
    email,
    password
  } = body;
  const existUser = await database.user.findUnique({ where: { email } });

  if (!existUser || !(await bcrypt.compare(password, existUser.password))) {
    throw errorWithStatus(HTTP_STATUSES.FAIL_UNAUTHORIZED_401, 'invalid email or password');
  }

  if (existUser.isAnonymous) {
    throw errorWithStatus(HTTP_STATUSES.FAIL_FORBIDDEN_403, 'invalid email or password');
  }

  const loggedinUser = await database.user.update({
    where: { id: existUser.id },
    data: {
      lastLoginAt: new Date(),
      lastLoginIp: ip
    }
  });

  const token = jwt.sign(
    {
      id: existUser.id,
      role: existUser.role,
      isAnonymous: existUser.isAnonymous
    },
    SECRET_KEY,
    { expiresIn: COMMON_DEFAULTS.TOKEN_EXPIRES_IN }
  );

  return {
    token: token,
    user: loggedinUser
  };
};