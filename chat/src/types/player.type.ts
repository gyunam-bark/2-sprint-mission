import type { WebSocket } from 'ws';

export type Player = {
  id: string;
  ws: WebSocket;
};
