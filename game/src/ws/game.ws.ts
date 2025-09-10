import { WebSocketServer, WebSocket, RawData } from 'ws';
import type { Server } from 'http';
import { Player } from '../types/player.type';
import { movePlayer, getNearbyPlayerList } from '../services/player.service';
import { verifyAccessToken } from '../utils/jwt.util';

const players = new Map<string, Player>();

export function setupGameWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/game' });

  function broadcast(message: any, exclude?: WebSocket) {
    const msg = JSON.stringify(message);
    players.forEach((p) => {
      if (p.ws.readyState === WebSocket.OPEN && p.ws !== exclude) {
        p.ws.send(msg);
      }
    });
  }

  wss.on('join', (ws: WebSocket) => {
    let current: Player | null = null;

    ws.on('message', async (msg: RawData) => {
      try {
        const data = JSON.parse(msg.toString());

        // --- 인증 ---
        if (data.type === 'auth' || data.type === 'reauth') {
          try {
            const payload = verifyAccessToken(data.token);
            if (current) players.delete(current.id);

            current = { id: payload.id, x: 0, y: 0, ws: ws, dir: 0 };
            players.set(current.id, current);

            ws.send(JSON.stringify({ type: data.type, success: true, id: current.id }));

            // 접속 알림
            broadcast({ type: 'join', id: current.id, x: current.x, y: current.y }, ws);

            // 현재 접속자 목록 전송
            ws.send(
              JSON.stringify({
                type: 'state',
                players: Array.from(players.values()).map((p) => ({
                  id: p.id,
                  x: p.x,
                  y: p.y,
                })),
              })
            );
          } catch {
            ws.send(JSON.stringify({ type: data.type, success: false, error: 'Invalid token' }));
            ws.close();
          }
          return;
        }

        // --- 인증 안된 경우 ---
        if (!current) {
          ws.send(JSON.stringify({ error: 'Not authenticated' }));
          return;
        }

        // --- 이동 ---
        if (data.type === 'move') {
          current.x = data.x;
          current.y = data.y;
          current.dir = data.dir;
          await movePlayer(current.id, current.x, current.y);

          // 내 상태 갱신
          ws.send(
            JSON.stringify({
              type: 'selfUpdate',
              id: current.id,
              x: current.x,
              y: current.y,
              dir: current.dir,
            })
          );

          // 다른 플레이어에게 알림
          broadcast(
            {
              type: 'playerMove',
              id: current.id,
              x: current.x,
              y: current.y,
              dir: current.dir,
            },
            ws
          );

          // 내게는 전체 상태 주기
          const nearby = await getNearbyPlayerList(current.id, 50);
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
        broadcast({ type: 'leave', id: current.id });
      }
    });
  });

  console.log('WebSocket Game server running on /game');
}
