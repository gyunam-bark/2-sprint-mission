import { Context } from 'koa';
import { getHealthCheck } from '../services/root.service';
import { successResponse } from '../utils/response.util';

export const handleGetHealthCheck = async (ctx: Context) => {
  const result = await getHealthCheck();
  ctx.status = 200;
  ctx.body = successResponse(result);
};
