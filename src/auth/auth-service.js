import ENV from '../config/env.js';
import { Payload } from './auth-model.js';
import prisma from '../prisma/prisma.js';
import { hashPassword, comparePassword } from '../util/crypt-util.js';
import { HttpError } from '../util/error-util.js';
import {
  generateAccessToken,
  generateRefreshToken,
  getAccessTokenRemainSeconds,
  verifyRefreshToken,
} from '../util/token-util.js';
import { addHours, addDays } from 'date-fns';
import { COOKIE_OPTIONS, REDIS_SET } from './auth-constant.js';
import redis from '../redis/redis.js';
import { runWithdrawTransaction } from '../prisma/transaction.js';
import COMMON_STATUS from '../common/common-status.js';

export const register = async (body) => {
  try {
    const { email, password, nickname } = body;

    // 해당 EMAIL 로 생성된 사용자가 있는지 확인
    const existUser = await prisma.user.findUnique({ where: { email } });
    if (existUser) {
      throw new HttpError(409, '이미 해당 이메일로 가입된 사용자가 있습니다.');
    }

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

    const existUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!existUser) {
      throw new HttpError(400, '존재하지 않는 사용자입니다.');
    }

    const isValidPassword = await comparePassword(password, existUser.password);
    if (!isValidPassword) {
      throw new HttpError(400, '비밀번호가 잘못 되었습니다.');
    }

    const transactionData = { status: COMMON_STATUS.INACTIVE, deletedAt: new Date() };

    const results = await runWithdrawTransaction(existUser.id, transactionData);

    const withdrawedUser = results.pop();

    return withdrawedUser;
  } catch (error) {
    throw error;
  }
};

export const login = async (body) => {
  try {
    const { email, password } = body;

    const existUser = await prisma.user.findUnique({ where: { email } });
    if (!existUser) {
      throw new HttpError(400, '접속 정보를 다시 확인해주세요.');
    }

    const isInactive = existUser.status === COMMON_STATUS.INACTIVE;
    if (isInactive) {
      throw new HttpError(400, '접속할 수 없는 계정입니다.');
    }

    const isValidPassword = await comparePassword(password, existUser.password);
    if (!isValidPassword) {
      throw new HttpError(400, '접속 정보를 다시 확인해주세요.');
    }

    const payload = new Payload(existUser);

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

export const logout = async (accessToken, refreshToken) => {
  try {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new HttpError(500);
    }

    const userId = payload.id;

    const expirySeconds = getAccessTokenRemainSeconds(accessToken);

    await redis.set(
      REDIS_SET.KEY(accessToken),
      REDIS_SET.VALUE.BLACKLIST,
      REDIS_SET.SECONDS_TOKEN,
      REDIS_SET.SECONDS(expirySeconds)
    );

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

    const existUser = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!existUser) {
      throw new HttpError(400);
    }

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
