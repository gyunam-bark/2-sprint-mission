import { Context } from 'koa';
import { signup, signin, refresh } from '../services/auth.service';
import { SignInRequest, SignUpRequest } from '../types/user.type';
import { errorResponse, successResponse } from '../utils/response.util';
import { RefreshRequest } from '../types/auth.type';

export const handleSignUp = async (ctx: Context) => {
  const { username, password } = ctx.request.body as SignUpRequest;

  if (!username || !password) {
    ctx.throw(400, 'Username and password are required');
  }

  const result = await signup(username, password);
  ctx.status = 201;
  ctx.body = successResponse(result);
};

export const handleSignIn = async (ctx: Context) => {
  const { username, password } = ctx.request.body as SignInRequest;

  if (!username || !password) {
    ctx.throw(400, 'Username and password are required');
  }

  const result = await signin(username, password);
  ctx.status = 200;
  ctx.body = successResponse(result);
};

export async function handleRefresh(ctx: Context) {
  const { refreshToken } = ctx.request.body as RefreshRequest;

  if (!refreshToken) {
    ctx.status = 400;
    ctx.body = errorResponse(400, 'Refresh token is required');
    return;
  }

  try {
    const tokens = await refresh(refreshToken);
    ctx.status = 200;
    ctx.body = successResponse(tokens);
  } catch (err) {
    ctx.status = 401;
    ctx.body = errorResponse(401, (err as Error).message);
  }
}
