import type { WebSocket } from 'ws';

export type Player = {
  id: string;
  x: number;
  y: number;
  dir: number;
  ws: WebSocket;
};
