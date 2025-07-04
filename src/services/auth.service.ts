import ENV from '../utils/env.util';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  LockedError,
  NotFoundError,
  UnauthorizedError,
} from '../types/error.type';
import { loginRequest, RegisterRequest } from '../types/auth.type';
import { comparePassword, hashPassword } from '../utils/password.util';
import {
  createRefreshTokenEntity,
  createUserEntity,
  deleteRefreshTokenEntity,
  getRefreshTokenEntity,
  getRefreshTokenEntityById,
  updateRefreshTokenEntity,
} from '../repositories/auth.repository';
import { isUserInactive, isUserLock } from '../utils/user.util';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../utils/token.util';
import { userToPayload } from '../utils/to.util';
import { addDays, addHours } from 'date-fns';
import { getCookieOptions } from '../utils/cookie.util';
import { addTokenToBlacklist } from '../utils/redis.util';
import { Payload } from '../types/payload.type';
import {
  deactivateUserEntity,
  getUserEntityByEmail,
  getUserEntityById,
  updateUserEntity,
} from '../repositories/users.repository';
import { UserParams } from '../types/user.type';
import { UserEntity } from '../entities/user.entity';
import { USER_STATUS } from '../enums/user.enum';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';

export const register = async (request: RegisterRequest) => {
  const { body } = request;
  const { email, password, nickname } = body;

  const existUser = await getUserEntityByEmail(email);
  if (existUser) {
    throw new ConflictError();
  }

  const hashedPassword = await hashPassword(password);

  const user = new UserEntity();

  user.email = email;
  user.password = hashedPassword;
  user.nickname = nickname;

  const createdUser = await createUserEntity(user);

  return createdUser;
};

export const withdraw = async (user: Payload, request: RegisterRequest) => {
  const { body } = request;
  const { password } = body;

  const existUser = await getUserEntityById(user.id);
  if (!existUser) {
    throw new UnauthorizedError();
  }

  const isValidPassword = await comparePassword(password, existUser.password);
  if (!isValidPassword) {
    throw new UnauthorizedError();
  }

  const userParams: UserParams = {
    id: existUser.id,
  };

  const withdrawedUser = await deactivateUserEntity(userParams);

  return withdrawedUser;
};

export const login = async (request: loginRequest, ip: string) => {
  const { body } = request;
  const { email, password } = body;

  const user = await getUserEntityByEmail(email);
  if (user === null) {
    throw new NotFoundError();
  }

  if (isUserLock(user)) {
    throw new LockedError();
  }

  if (isUserInactive(user)) {
    throw new ForbiddenError();
  }

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    user.updatedAt = new Date();

    user.loginAttempts += 1;

    if (user.loginAttempts >= ENV.LOGIN_ATTEMPTS_MAX) {
      user.status = USER_STATUS.LOCK;
      user.loginAttempts = ENV.LOGIN_ATTEMPTS_MAX;

      await updateUserEntity(user);

      throw new LockedError();
    }
    await updateUserEntity(user);
  }

  user.lastLoginAt = new Date();
  user.lastLoginIp = ip;

  await updateUserEntity(user);

  const payload = userToPayload(user);

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const now = new Date();
  const accessExpiresAt = addHours(now, ENV.ACCESS_EXPIRY_VALUE);
  const refreshExpiresAt = addDays(now, ENV.REFRESH_EXPIRY_VALUE);

  const refreshTokenEntity = await getRefreshTokenEntity(user);

  if (refreshTokenEntity) {
    refreshTokenEntity.token = refreshToken;
    refreshTokenEntity.expiresAt = refreshExpiresAt;

    await updateRefreshTokenEntity(refreshTokenEntity);
  } else {
    const newRefreshTokenEntity = new RefreshTokenEntity();
    newRefreshTokenEntity.user = user;
    newRefreshTokenEntity.token = refreshToken;
    newRefreshTokenEntity.expiresAt = refreshExpiresAt;
    newRefreshTokenEntity.createdAt = new Date();

    await createRefreshTokenEntity(newRefreshTokenEntity);
  }

  const accessCookieOptions = getCookieOptions(accessExpiresAt);
  const refreshCookieOptions = getCookieOptions(refreshExpiresAt);

  return {
    accessToken,
    refreshToken,
    accessCookieOptions,
    refreshCookieOptions,
  };
};

export const logout = async (accessToken: string, refreshToken: string) => {
  const payload = verifyAccessToken(accessToken);
  if (!payload) {
    throw new BadRequestError();
  }

  await deleteRefreshTokenEntity(payload);

  await addTokenToBlacklist(accessToken);
  await addTokenToBlacklist(refreshToken);
};

export const refresh = async (user: Payload, accessToken: string, refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    throw new BadRequestError();
  }

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  await addTokenToBlacklist(accessToken);
  await addTokenToBlacklist(refreshToken);

  const now = new Date();
  const accessExpiresAt = addHours(now, ENV.ACCESS_EXPIRY_VALUE);
  const refreshExpiresAt = addDays(now, ENV.REFRESH_EXPIRY_VALUE);

  const refreshTokenEntity = await getRefreshTokenEntityById(user.id);

  refreshTokenEntity.token = newRefreshToken;
  refreshTokenEntity.expiresAt = refreshExpiresAt;

  await updateRefreshTokenEntity(refreshTokenEntity);

  const accessCookieOptions = getCookieOptions(accessExpiresAt);
  const refreshCookieOptions = getCookieOptions(refreshExpiresAt);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessCookieOptions,
    refreshCookieOptions,
  };
};
