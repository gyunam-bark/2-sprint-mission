import { setMyPlayer, addOrUpdateOtherPlayer, removeOtherPlayer } from './state';
import { Player } from './types';
import { addMessageToBox } from './ui';
import { ClientChatMessage } from './types';

let myId = '';
let gameSocket: WebSocket;
let chatSocket: WebSocket;

function getAuthToken(): string | null {
  return localStorage.getItem('accessToken');
}

// ---------------- 게임 네트워크 ----------------
export function initWebSocket() {
  gameSocket = new WebSocket('ws://localhost:3000/game');

  gameSocket.onopen = () => {
    console.log('Game connected. Authenticating...');
    const authToken = getAuthToken();
    if (authToken) {
      gameSocket.send(JSON.stringify({ type: 'auth', token: authToken }));
    } else {
      console.error('Authentication token not found.');
      gameSocket.close();
    }
  };

  gameSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    handleGameMessage(data);
  };

  gameSocket.onclose = () => console.log('Game connection closed.');
  gameSocket.onerror = (error) => console.error('WebSocket Error (game):', error);
}

function handleGameMessage(data: any) {
  switch (data.type) {
    case 'auth':
      if (data.success) {
        myId = data.id;
        console.log(`Game authenticated successfully. My ID is: ${myId}`);
      } else {
        console.error('Game authentication failed:', data.error);
        gameSocket.close();
      }
      break;

    case 'reauth':
      if (data.success) {
        setMyPlayer({ id: data.id });
        console.log(`Game re-authenticated successfully. My ID is ${data.id}`);
      } else {
        console.error('Game re-authentication failed:', data.error);
        gameSocket.close();
      }
      break;

    case 'state':
      data.players.forEach((p: Player) => addOrUpdateOtherPlayer(p));
      break;

    case 'join':
    case 'playerMove':
      addOrUpdateOtherPlayer(data as Player);
      break;

    case 'selfUpdate':
      setMyPlayer(data);
      break;

    case 'leave':
      removeOtherPlayer(data.id);
      break;
  }
}

export function sendMoveUpdate(player: Player) {
  if (gameSocket && gameSocket.readyState === WebSocket.OPEN && player.id) {
    gameSocket.send(JSON.stringify({ type: 'move', x: player.x, y: player.y, dir: player.dir }));
  }
}

// ---------------- 채팅 네트워크 ----------------
export function initChatNetwork() {
  chatSocket = new WebSocket('ws://localhost:3000/chat');

  chatSocket.onopen = () => {
    console.log('Chat connected. Authenticating...');
    const token = getAuthToken();
    if (token) {
      chatSocket.send(JSON.stringify({ type: 'auth', token }));
    } else {
      console.error('Chat authentication failed: Token not found.');
      chatSocket.close();
    }
  };

  chatSocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      handleChatMessage(data);
    } catch (error) {
      console.error('Failed to parse chat server message:', event.data);
    }
  };

  chatSocket.onclose = () => console.log('Chat connection closed.');
  chatSocket.onerror = (error) => console.error('Chat WebSocket Error:', error);
}

function handleChatMessage(data: any) {
  switch (data.type) {
    case 'auth':
      if (data.success) {
        console.log(`Chat authenticated successfully. My ID is: ${data.id}`);
      } else {
        console.error('Chat authentication failed:', data.error);
        chatSocket.close();
      }
      break;

    case 'chat':
      console.log('Received chat message:', data);
      if (data.from && data.msg) {
        const isMine = data.from === myId;
        addMessageToBox(data.from, data.msg, isMine);
      } else {
        console.warn('Malformed chat message received:', data);
      }
      break;

    default:
      console.log('Unhandled chat message:', data);
      break;
  }
}

export function sendChatMessage(message: string) {
  console.log('Sending chat message:', message);
  if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
    const chatMessage: ClientChatMessage = {
      type: 'chat',
      scope: 'global',
      msg: message,
    };
    console.log('Chat message payload:', chatMessage);
    chatSocket.send(JSON.stringify(chatMessage));
  }
}
