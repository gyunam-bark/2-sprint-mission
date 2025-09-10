import { WebSocketServer, WebSocket, RawData } from 'ws';
import type { Server } from 'http';
import { Player } from '../types/player.type';
import { movePlayer, getNearbyPlayerList } from '../services/player.service';
import { verifyAccessToken } from '../utils/jwt.util';

const players = new Map<string, Player>();

export function setupGameWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/game' });

  wss.on('connection', (ws: WebSocket) => {
    let current: Player | null = null;

    ws.on('message', async (msg: RawData) => {
      try {
        const data = JSON.parse(msg.toString());

        if (data.type === 'auth') {
          try {
            const payload = verifyAccessToken(data.token);
            current = { id: payload.id, x: 0, y: 0, ws };
            players.set(current.id, current);
            ws.send(JSON.stringify({ type: 'auth', success: true, id: current.id }));
          } catch {
            ws.send(JSON.stringify({ type: 'auth', success: false, error: 'Invalid token' }));
            ws.close();
          }
          return;
        }

        if (data.type === 'reauth') {
          try {
            const payload = verifyAccessToken(data.token);
            if (current) players.delete(current.id);
            current = { id: payload.id, x: 0, y: 0, ws };
            players.set(current.id, current);
            ws.send(JSON.stringify({ type: 'reauth', success: true, id: current.id }));
          } catch {
            ws.send(JSON.stringify({ type: 'reauth', success: false, error: 'Invalid token' }));
            ws.close();
          }
          return;
        }

        if (!current) {
          ws.send(JSON.stringify({ error: 'Not authenticated' }));
          return;
        }

        if (data.type === 'move') {
          current.x = data.x;
          current.y = data.y;
          await movePlayer(current.id, current.x, current.y);

          const nearby = await getNearbyPlayerList(current.id, 50);

          players.forEach((p) => {
            if (nearby.find((n) => n.id === p.id)) {
              p.ws.send(
                JSON.stringify({
                  type: 'playerMove',
                  id: current!.id,
                  x: current!.x,
                  y: current!.y,
                })
              );
            }
          });

          ws.send(
            JSON.stringify({
              type: 'nearbyPlayers',
              players: nearby,
            })
          );
        }
      } catch (err) {
        console.error('Invalid WS message:', err);
      }
    });

    ws.on('close', () => {
      if (current) {
        players.delete(current.id);
        console.log(`Player ${current.id} disconnected`);
      }
    });
  });

  console.log('WebSocket Game server running on /game');
}
