import { Context, Next } from 'koa';
import { verifyAccessToken } from '../utils/jwt.util';
import { errorResponse } from '../utils/response.util';

export const authMiddleware = async (ctx: Context, next: Next) => {
  const authHeader = ctx.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = errorResponse(401, 'Unauthorized');
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    ctx.state.user = payload;
    await next();
  } catch {
    ctx.status = 401;
    ctx.body = errorResponse(401, 'Invalid token');
  }
};
