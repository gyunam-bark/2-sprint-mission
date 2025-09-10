import { Context } from 'koa';
import { signup, signin } from '../services/auth.service';
import { SignInRequest, SignUpRequest } from '../types/user.type';
import { successResponse } from '../utils/response.util';

export const handleSignUp = async (ctx: Context) => {
  const { username, email, password } = ctx.request.body as SignUpRequest;

  if (!username || !email || !password) {
    ctx.throw(400, 'Username, email, and password are required');
  }

  const result = await signup(username, password, email);
  ctx.status = 201;
  ctx.body = successResponse(result);
};

export const handleSignIn = async (ctx: Context) => {
  const { email, password } = ctx.request.body as SignInRequest;

  if (!email || !password) {
    ctx.throw(400, 'Email and password are required');
  }

  const result = await signin(email, password);
  ctx.status = 200;
  ctx.body = successResponse(result);
};
