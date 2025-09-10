import { WebSocketServer, WebSocket, RawData } from 'ws';
import type { Server } from 'http';
import { Player } from '../types/player.type';
import { movePlayer, getNearbyPlayerList } from '../services/player.service';
import { verifyWebSocketAuthorization } from '../utils/ws.util';

const players = new Map<string, Player>();

export function setupGameWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/game' });

  wss.on('connection', async (ws: WebSocket, req) => {
    let current: Player | null = null;

    try {
      const payload = await verifyWebSocketAuthorization(req);

      current = { id: payload.id, x: 0, y: 0, ws };
      players.set(payload.id, current);

      console.log(`Player ${payload.id} connected`);

      ws.send(JSON.stringify({ type: 'welcome', id: payload.id }));
    } catch (err) {
      console.error('Unauthorized WebSocket connection:', err);
      ws.close(1008, 'Unauthorized');
      return;
    }

    ws.on('message', async (msg: RawData) => {
      try {
        const data = JSON.parse(msg.toString());

        if (data.type === 'move' && current) {
          current.x = data.x;
          current.y = data.y;

          await movePlayer(current.id, current.x, current.y);

          const nearby = await getNearbyPlayerList(current.id, 50);

          // 주변 플레이어에게 전송
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

          // 자기 자신에게 주변 플레이어 좌표 전달
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
