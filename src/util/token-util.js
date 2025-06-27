import jwt from 'jsonwebtoken';
import ENV from '../config/env.js';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { Payload } from '../auth/auth-model.js';
import { UnauthorizedError } from './error-util.js';
import { AUTH_STRINGS } from '../auth/auth-constant.js';

// ACCESS_TOKEN 생성
export const generateAccessToken = (payload) => {
  if (!payload instanceof Payload) {
    throw new UnauthorizedError();
  }

  const expiresIn = ENV.ACCESS_EXPIRY_VALUE + ENV.ACCESS_EXPIRY_UNIT;
  return jwt.sign(payload.toJSON(), ENV.ACCESS_SECRET_KEY, { expiresIn });
};

// REFRESH_TOKEN 생성
export const generateRefreshToken = (payload) => {
  if (!payload instanceof Payload) {
    throw new UnauthorizedError();
  }

  const expiresIn = ENV.REFRESH_EXPIRY_VALUE + ENV.REFRESH_EXPIRY_UNIT;
  return jwt.sign(payload.toJSON(), ENV.REFRESH_SECRET_KEY, { expiresIn });
};

// ACCESS_TOKEN 검증
export const verifyAccessToken = (token = '') => {
  try {
    return new Payload(jwt.verify(token, ENV.ACCESS_SECRET_KEY));
  } catch (error) {
    return null;
  }
};

// REFRESH_TOKEN 검증
export const verifyRefreshToken = (token = '') => {
  try {
    return new Payload(jwt.verify(token, ENV.REFRESH_SECRET_KEY));
  } catch (error) {
    return null;
  }
};

// TOKEN 남은 기간
export const getAccessTokenRemainSeconds = (token) => {
  const decoded = jwt.decode(token);
  const now = Math.floor(Date.now() / 1000);
  const expireAt = decoded.exp;

  return expireAt - now;
};

export const getAccessToken = (c) => getCookie(c, AUTH_STRINGS.ACCESS_TOKEN);
export const getRefreshToken = (c) => getCookie(c, AUTH_STRINGS.REFRESH_TOKEN);
export const setAccessToken = (c, token, options) => setCookie(c, AUTH_STRINGS.ACCESS_TOKEN, token, options);
export const setRefreshToken = (c, token, options) => setCookie(c, AUTH_STRINGS.REFRESH_TOKEN, token, options);
export const deleteAccessToken = (c) => deleteCookie(c, AUTH_STRINGS.ACCESS_TOKEN);
export const deleteRefreshToken = (c) => deleteCookie(c, AUTH_STRINGS.REFRESH_TOKEN);
