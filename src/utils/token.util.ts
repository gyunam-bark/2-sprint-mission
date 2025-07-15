import { CookieOptions, Request, Response } from 'express';
import ENV from './env.util';
import jwt from 'jsonwebtoken';
import { Payload } from '../types/payload.type';
import { COOKIE_TYPE } from '../enums/cookie.enum';
import { InternalServerError } from '../types/error.type';

// ACCESS_TOKEN 생성
export const generateAccessToken = (payload: Payload): string => {
  const { exp, ...other } = payload;
  const expiresIn = ENV.ACCESS_EXPIRY_VALUE + ENV.ACCESS_EXPIRY_UNIT;

  return jwt.sign(other, ENV.ACCESS_SECRET_KEY, { expiresIn });
};

// REFRESH_TOKEN 생성
export const generateRefreshToken = (payload: Payload): string => {
  const { exp, ...other } = payload;
  const expiresIn = ENV.REFRESH_EXPIRY_VALUE + ENV.REFRESH_EXPIRY_UNIT;

  return jwt.sign(other, ENV.REFRESH_SECRET_KEY, { expiresIn });
};

// ACCESS_TOKEN 검증
export const verifyAccessToken = (token: string): Payload => {
  return jwt.verify(token, ENV.ACCESS_SECRET_KEY) as Payload;
};

// REFRESH_TOKEN 검증
export const verifyRefreshToken = (token: string): Payload => {
  return jwt.verify(token, ENV.REFRESH_SECRET_KEY) as Payload;
};

// ACCESS_TOKEN GET/SET/DELETE
export const setAccessToken = (res: Response, token: string, options: CookieOptions) =>
  res.cookie(COOKIE_TYPE.ACCESS, token, options);
export const getAccessToken = (req: Request) => req.cookies[COOKIE_TYPE.ACCESS];
export const deleteAccessToken = (res: Response) => res.clearCookie(COOKIE_TYPE.ACCESS);

// REFRESH_TOKEN GET/SET/DELETE
export const setRefreshToken = (res: Response, token: string, options: CookieOptions) =>
  res.cookie(COOKIE_TYPE.REFRESH, token, options);
export const getRefreshToken = (req: Request) => req.cookies[COOKIE_TYPE.REFRESH];
export const deleteRefreshToken = (res: Response) => res.clearCookie(COOKIE_TYPE.REFRESH);

//
export const getTokenRemainSeconds = (token: string): number => {
  const decoded = jwt.decode(token) as jwt.JwtPayload | null;
  if (!decoded) {
    throw new InternalServerError('invalid token: decode failed');
  }

  const { exp } = decoded;
  if (typeof exp !== 'number') {
    throw new InternalServerError('invalid token: missing exp');
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return exp - nowInSeconds;
};
