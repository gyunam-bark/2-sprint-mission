import { RequestHandler } from 'express';
import { login, logout, refresh, register, withdraw } from '../services/auth.service';
import { successResponse } from '../utils/response.util';
import { loginRequest, RegisterRequest } from '../types/auth.type';
import { getIp } from '../utils/from.util';

import {
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '../utils/token.util';
import { getUser } from '../utils/user.util';

export const handleReigster: RequestHandler = async (req, res, next) => {
  const data = await register(req.validated as RegisterRequest);

  res.status(201).json(successResponse(data));
};

export const handleWithdraw: RequestHandler = async (req, res, next) => {
  const user = getUser(req);

  const accessToken = getAccessToken(req);
  const refreshToken = getRefreshToken(req);

  await logout(accessToken, refreshToken);

  deleteAccessToken(res);
  deleteRefreshToken(res);

  const data = await withdraw(user, req.validated as RegisterRequest);

  res.status(200).json(successResponse(data));
};

export const handleLogin: RequestHandler = async (req, res, next) => {
  const ip = getIp(req);

  const loggedIn = await login(req.validated as loginRequest, ip);

  setAccessToken(res, loggedIn.accessToken, loggedIn.accessCookieOptions);
  setRefreshToken(res, loggedIn.refreshToken, loggedIn.refreshCookieOptions);

  const data = { token: loggedIn.accessToken, refreshToken: loggedIn.refreshToken };

  res.status(200).json(successResponse(data));
};

export const handleLogout: RequestHandler = async (req, res, next) => {
  const accessToken = getAccessToken(req);
  const refreshToken = getRefreshToken(req);

  await logout(accessToken, refreshToken);

  deleteAccessToken(res);
  deleteRefreshToken(res);

  res.status(200).json(successResponse(undefined));
};

export const handleRefresh: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const accessToken = getAccessToken(req);
  const refreshToken = getRefreshToken(req);

  const refreshed = await refresh(user, accessToken, refreshToken);

  setAccessToken(res, refreshed.accessToken, refreshed.accessCookieOptions);
  setRefreshToken(res, refreshed.refreshToken, refreshed.refreshCookieOptions);

  const data = { token: refreshed.accessToken, refreshToken: refreshed.refreshToken };

  res.status(200).json(successResponse(data));
};
