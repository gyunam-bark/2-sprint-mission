import { ExtendedError, Socket } from 'socket.io';
import { UnauthorizedError } from '../types/error.type';
import cookie from 'cookie';
import { COOKIE_TYPE } from '../enums/cookie.enum';
import { verifyAccessToken } from '../utils/token.util';
import { Payload } from '../types/payload.type';

export const handshake = (socket: Socket, next: (err?: ExtendedError) => void) => {
  const cookieHeader = socket.handshake.headers.cookie;

  if (!cookieHeader) {
    return next(new UnauthorizedError());
  }

  const cookies = cookie.parse(cookieHeader);
  const token = cookies[COOKIE_TYPE.ACCESS];

  if (!token) {
    return next(new UnauthorizedError());
  }

  const payload = verifyAccessToken(token) as Payload;

  socket.data.user = payload;
  socket.join(payload.id);

  return next();
};
