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

// 사용자 생성
export const handleRegister = async (c) => {
  try {
    const { body } = await getValidate(c);

    const registeredUser = await register(body);

    const registerResponse = new RegisterResponse(registeredUser);

    const response = {
      success: true,
      data: registerResponse.toJSON(),
    };

    return c.json(response, 201);
  } catch (error) {
    throw error;
  }
};

// 사용자 탈퇴
export const handleWithdraw = async (c) => {
  try {
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
  } catch (error) {
    throw error;
  }
};

// 로그인
export const handleLogin = async (c) => {
  try {
    const { body } = await getValidate(c);

    const { accessToken, refreshToken, cookieOptionAccess, cookieOptionRefresh } = await login(body);

    setAccessToken(c, accessToken, cookieOptionAccess);
    setRefreshToken(c, refreshToken, cookieOptionRefresh);

    const loginResponse = new LoginResponse(accessToken);

    const response = {
      success: true,
      data: loginResponse.toJSON(),
    };

    return c.json(response);
  } catch (error) {
    throw error;
  }
};

export const handleLogout = async (c) => {
  try {
    const accessToken = getAccessToken(c);
    const refreshToken = getRefreshToken(c);

    await logout(accessToken, refreshToken);

    deleteAccessToken(c);
    deleteRefreshToken(c);

    const response = {
      success: true,
      data: '로그아웃 성공',
    };

    return c.json(response);
  } catch (error) {
    throw error;
  }
};

export const handleRefresh = async (c) => {
  try {
    const currentRefreshToken = getRefreshToken(c);

    const { accessToken, refreshToken, cookieOptionAccess, cookieOptionRefresh } = await refresh(currentRefreshToken);

    setAccessToken(c, accessToken, cookieOptionAccess);
    setRefreshToken(c, refreshToken, cookieOptionRefresh);

    const refreshResponse = new RefreshResponse(accessToken);

    return c.json({
      success: true,
      data: refreshResponse.toJSON(),
    });
  } catch (error) {
    throw error;
  }
};
