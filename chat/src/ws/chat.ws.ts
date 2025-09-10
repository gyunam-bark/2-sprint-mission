import { WebSocketServer, WebSocket, RawData } from 'ws';
import type { Server } from 'http';
import { saveMessage } from '../services/message.service';
import { Player } from '../types/player.type';
import axios from 'axios';
import { config } from '../config/config';

const players = new Map<string, Player>();

export function setupChatWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/chat' });

  wss.on('connection', (ws: WebSocket) => {
    let current: Player | null = null;

    ws.on('message', async (msg: RawData) => {
      const data = JSON.parse(msg.toString());

      if (data.type === 'join') {
        current = { id: data.id, ws };
        players.set(data.id, current);
      }

      if (data.type === 'chat' && current) {
        const { scope, msg: message } = data;

        await saveMessage({
          senderId: current.id,
          scope,
          message,
        });

        if (scope === 'global') {
          // 글로벌 브로드캐스트
          players.forEach((p) => p.ws.send(JSON.stringify({ from: current!.id, msg: message })));
        } else if (scope === 'local') {
          try {
            const res = await axios.get<{ players: string[] }>(`${config.external.gameService}/nearby/${current.id}`, {
              params: { radius: 50 },
            });

            const nearby = res.data.players;

            // 해당 플레이어에게만 메시지 전송
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
