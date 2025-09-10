import { Context } from 'koa';
import { movePlayer, getNearbyPlayerList } from '../services/player.service';
import { successResponse, errorResponse } from '../utils/response.util';

export const handleMovePlayer = async (ctx: Context) => {
  const { id, x, y } = ctx.request.body as { id: string; x: number; y: number };

  if (!id || x === undefined || y === undefined) {
    ctx.status = 400;
    ctx.body = errorResponse(400, 'id, x, y are required');
    return;
  }

  await movePlayer(id, x, y);

  ctx.status = 200;
  ctx.body = successResponse({ message: 'Player moved successfully' });
};

export const handleGetNearbyPlayerList = async (ctx: Context) => {
  const { id } = ctx.params;
  const radius = Number(ctx.query.radius ?? 50);

  if (!id) {
    ctx.status = 400;
    ctx.body = errorResponse(400, 'id is required');
    return;
  }

  const players = await getNearbyPlayerList(id, radius);

  ctx.status = 200;
  ctx.body = successResponse({ players });
};
