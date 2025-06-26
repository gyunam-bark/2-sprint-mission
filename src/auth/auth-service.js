import ENV from '../config/env.js';
import { Payload } from './auth-model.js';
import prisma from '../prisma/prisma.js';
import { hashPassword, comparePassword } from '../util/crypt-util.js';
import { HttpError } from '../util/error-util.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../util/token-util.js';
import { addHours, addDays } from 'date-fns';
import { runWithdrawTransaction } from '../prisma/transaction.js';
import { COOKIE_OPTIONS } from './auth-constant.js';
import { USER_STATUS } from '../constant/constant.js';
import { addAccessTokenToBlacklist } from '../util/redis-util.js';
import { getExistUser, checkExistUserWithEmail, checkUserLock, checkUserInactive } from '../util/user-util.js';

export const register = async (body) => {
  try {
    const { email, password, nickname } = body;

    // 해당 EMAIL 로 생성된 사용자가 있는지 확인
    await checkExistUserWithEmail(email);

    // 비밀번호 해시
    const hashedPassword = await hashPassword(password);

    // 사용자 생성
    const createdUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
      },
    });

    return createdUser;
  } catch (error) {
    throw error;
  }
};

export const withdraw = async (user, body) => {
  try {
    const { password } = body;

    const existUser = await getExistUser({ id: user.id });

    await comparePassword(password, existUser.password);

    const transactionData = { status: USER_STATUS.INACTIVE, deletedAt: new Date() };

    const results = await runWithdrawTransaction(existUser.id, transactionData);

    const withdrawedUser = results.pop();

    return withdrawedUser;
  } catch (error) {
    throw error;
  }
};

export const login = async (body, ip) => {
  try {
    const { email, password } = body;

    const existUser = await getExistUser({ email });

    checkUserInactive(existUser);
    checkUserLock(existUser);

    await comparePassword(password, existUser.password, async () => {
      const attemptedUser = await prisma.user.update({
        where: { id: existUser.id },
        data: {
          loginAttempts: {
            increment: 1,
          },
        },
      });

      if (attemptedUser.loginAttempts >= ENV.LOGIN_ATTEMPTS_MAX) {
        await prisma.user.update({
          where: { id: attemptedUser.id },
          data: {
            status: USER_STATUS.LOCK,
          },
        });
      }
    });

    const loggedinUser = await prisma.user.update({
      where: { id: existUser.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ip,
      },
    });

    const payload = new Payload(loggedinUser);

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const now = new Date();
    const accessExpiresAt = addHours(now, ENV.ACCESS_EXPIRY_VALUE);
    const refreshExpiresAt = addDays(now, ENV.REFRESH_EXPIRY_VALUE);

    await prisma.refreshToken.upsert({
      where: { userId: loggedinUser.id },
      update: { token: refreshToken },
      create: {
        userId: loggedinUser.id,
        token: refreshToken,
        expiresAt: refreshExpiresAt,
      },
    });

    const cookieOptionDefault = {
      httpOnly: true,
      secure: COOKIE_OPTIONS.SECURE.WHEN_PRODUCTION,
      sameSite: COOKIE_OPTIONS.SAME_SITE.STRICT,
    };

    const cookieOptionAccess = {
      ...cookieOptionDefault,
      expires: accessExpiresAt,
    };

    const cookieOptionRefresh = {
      ...cookieOptionDefault,
      expires: refreshExpiresAt,
    };

    return {
      accessToken,
      refreshToken,
      cookieOptionAccess,
      cookieOptionRefresh,
    };
  } catch (error) {
    throw error;
  }
};

export const logout = async (accessToken, refreshToken) => {
  try {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new HttpError(500);
    }

    const userId = payload.id;

    await addAccessTokenToBlacklist(accessToken);

    await prisma.refreshToken.deleteMany({ where: { userId } });
  } catch (error) {
    throw error;
  }
};

export const refresh = async (token) => {
  try {
    const payload = await verifyRefreshToken(token, ENV.REFRESH_SECRET_KEY);
    if (!payload) {
      throw new HttpError(500);
    }

    const existUser = await getExistUser({ id: payload.id });

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const now = new Date();
    const accessExpiresAt = addHours(now, ENV.ACCESS_EXPIRY_VALUE);
    const refreshExpiresAt = addDays(now, ENV.REFRESH_EXPIRY_VALUE);

    await prisma.refreshToken.upsert({
      where: { userId: existUser.id },
      update: { token: refreshToken },
      create: {
        userId: existUser.id,
        token: refreshToken,
        expiresAt: refreshExpiresAt,
      },
    });

    const cookieOptionDefault = {
      httpOnly: true,
      secure: COOKIE_OPTIONS.SECURE.WHEN_PRODUCTION,
      sameSite: COOKIE_OPTIONS.SAME_SITE.STRICT,
    };

    const cookieOptionAccess = {
      ...cookieOptionDefault,
      expires: accessExpiresAt,
    };

    const cookieOptionRefresh = {
      ...cookieOptionDefault,
      expires: refreshExpiresAt,
    };

    return {
      accessToken,
      refreshToken,
      cookieOptionAccess,
      cookieOptionRefresh,
    };
  } catch (error) {
    throw error;
  }
};
