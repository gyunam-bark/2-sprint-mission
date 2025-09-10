// chat.ws.ts

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
      // **수정**: 핸들러 전체를 try...catch로 감싸서 숨겨진 에러 잡기
      try {
        // **추가**: JSON 파싱 전에 원본 데이터부터 로그로 확인
        console.log(`[서버] 메시지 수신 (RAW): ${msg.toString()}`);

        const data = JSON.parse(msg.toString());

        console.log(`[서버] 메시지 수신 (PARSED):`, data);

        if (data.type === 'auth') {
          try {
            const payload = verifyAccessToken(data.token);
            current = { id: payload.id, ws };
            players.set(current.id, current);
            console.log(`[서버] 플레이어 인증 성공: ${current.id}. 현재 접속자: ${players.size}명`);
            ws.send(JSON.stringify({ type: 'auth', success: true, id: current.id }));
          } catch (authError) {
            console.error('[서버] 인증 토큰 오류:', authError);
            ws.send(JSON.stringify({ type: 'auth', success: false, error: 'Invalid token' }));
            ws.close();
          }
          return;
        }

        // --- 인증 검사 ---
        if (!current) {
          console.log('[서버] 인증되지 않은 유저의 메시지:', data);
          ws.send(JSON.stringify({ error: 'Not authenticated' }));
          return;
        }

        // --- 채팅 메시지 처리 ---
        if (data.type === 'chat') {
          const { scope, msg: message } = data;
          console.log(`[서버] 메시지 수신 from ${current.id}: [${scope}] ${message}`);

          await saveMessage({ senderId: current.id, scope, message });

          if (scope === 'global') {
            const recipientIds = Array.from(players.keys());
            console.log(`[서버] 메시지 전체 방송 to ${recipientIds.length}명:`, recipientIds);
            players.forEach((p) => {
              if (p.ws.readyState === WebSocket.OPEN) {
                p.ws.send(JSON.stringify({ from: current!.id, msg: message }));
              }
            });
          } else if (scope === 'local') {
            // 로컬 채팅 로직 (생략)
          }
        } else {
          console.log(`[서버] 'chat' 타입이 아닌 메시지 수신:`, data);
        }
      } catch (error) {
        // **추가**: 핸들러 내에서 발생하는 모든 에러를 여기서 잡습니다.
        console.error('[서버] 메시지 처리 중 심각한 오류 발생:', error);
      }
    });

    ws.on('close', () => {
      if (current) {
        players.delete(current.id);
        console.log(`[서버] 플레이어 접속 종료: ${current.id}. 현재 접속자: ${players.size}명`);
      }
    });
  });

  console.log('WebSocket Chat server running on /chat');
}
