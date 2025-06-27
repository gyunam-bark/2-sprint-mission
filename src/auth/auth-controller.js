import { LoginResponse, RefreshResponse, RegisterResponse, WithdrawResponse } from './auth-model.js';
import { register, login, logout, refresh, withdraw } from './auth-service.js';
import { getValidate } from '../util/validate-util.js';
import {
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '../util/token-util.js';
import { getUser } from '../util/user-util.js';
import { getIpFromContext } from '../util/from-util.js';

export const handleRegister = async (c) => {
  const { body } = await getValidate(c);

  const registeredUser = await register(body);

  const registerResponse = new RegisterResponse(registeredUser);

  const response = {
    success: true,
    data: registerResponse.toJSON(),
  };

  return c.json(response, 201);
};

export const handleWithdraw = async (c) => {
  const { body } = await getValidate(c);
  const user = await getUser(c);

  const accessToken = getAccessToken(c);
  const refreshToken = getRefreshToken(c);

  await logout(accessToken, refreshToken);

  deleteAccessToken(c);
  deleteRefreshToken(c);

  const withdrawedUser = await withdraw(user, body);

  const withdrawResponse = new WithdrawResponse(withdrawedUser);

  const response = {
    success: true,
    data: withdrawResponse.toJSON(),
  };

  return c.json(response, 200);
};

export const handleLogin = async (c) => {
  const { body } = await getValidate(c);

  const ip = getIpFromContext(c);

  const { accessToken, refreshToken, cookieOptionAccess, cookieOptionRefresh } = await login(body, ip);

  setAccessToken(c, accessToken, cookieOptionAccess);
  setRefreshToken(c, refreshToken, cookieOptionRefresh);

  const loginResponse = new LoginResponse(accessToken);

  const response = {
    success: true,
    data: loginResponse.toJSON(),
  };

  return c.json(response);
};

export const handleLogout = async (c) => {
  const accessToken = getAccessToken(c);
  const refreshToken = getRefreshToken(c);

  await logout(accessToken, refreshToken);

  deleteAccessToken(c);
  deleteRefreshToken(c);

  const response = {
    success: true,
    data: 'logout',
  };

  return c.json(response);
};

export const handleRefresh = async (c) => {
  const currentRefreshToken = getRefreshToken(c);

  const { accessToken, refreshToken, cookieOptionAccess, cookieOptionRefresh } = await refresh(currentRefreshToken);

  setAccessToken(c, accessToken, cookieOptionAccess);
  setRefreshToken(c, refreshToken, cookieOptionRefresh);

  const refreshResponse = new RefreshResponse(accessToken);

  return c.json({
    success: true,
    data: refreshResponse.toJSON(),
  });
};
