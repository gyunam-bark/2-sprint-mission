import { Context } from 'koa';
import { getHealthCheck } from '../services/root.service';

export const handleGetHealthCheck = async (ctx: Context) => {
  ctx.body = await getHealthCheck();
};
