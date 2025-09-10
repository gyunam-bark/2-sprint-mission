import { WebSocketServer, WebSocket, RawData } from 'ws';
import type { Server } from 'http';
import { saveMessage } from '../services/message.service';
import { Player } from '../types/player.type';
import axios from 'axios';
import { config } from '../config/config';
import { verifyAccessToken } from '../utils/jwt.util';

const players = new Map<string, Player>();

export function setupChatWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/chat' });

  wss.on('connection', (ws: WebSocket) => {
    let current: Player | null = null;

    ws.on('message', async (msg: RawData) => {
      const data = JSON.parse(msg.toString());

      if (data.type === 'auth') {
        try {
          const payload = verifyAccessToken(data.token);
          current = { id: payload.id, ws };
          players.set(current.id, current);
          ws.send(JSON.stringify({ type: 'auth', success: true }));
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
          current = { id: payload.id, ws };
          players.set(current.id, current);
          ws.send(JSON.stringify({ type: 'reauth', success: true }));
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

      if (data.type === 'chat') {
        const { scope, msg: message } = data;

        await saveMessage({
          senderId: current.id,
          scope,
          message,
        });

        if (scope === 'global') {
          players.forEach((p) => p.ws.send(JSON.stringify({ from: current!.id, msg: message })));
        } else if (scope === 'local') {
          try {
            const res = await axios.get<{ players: string[] }>(`${config.external.gameService}/nearby/${current.id}`, {
              params: { radius: 50 },
            });

            const nearby = res.data.players;

            nearby.forEach((id) => {
              const target = players.get(id);
              if (target) {
                target.ws.send(JSON.stringify({ from: current!.id, msg: message }));
              }
            });
          } catch (err) {
            console.error('Failed to fetch nearby players', err);
          }
        }
      }
    });

    ws.on('close', () => {
      if (current) players.delete(current.id);
    });
  });

  console.log('WebSocket Chat server running on /chat');
}
