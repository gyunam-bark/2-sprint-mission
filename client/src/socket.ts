export function getAuthToken(): string | null {
  return sessionStorage.getItem('accessToken');
}

export function createWebSocket(
  url: string,
  onOpen: (ws: WebSocket) => void,
  onMessage: (data: any) => void,
  onClose?: () => void,
  onError?: (err: Event) => void
): WebSocket {
  const ws = new WebSocket(url);

  ws.onopen = () => onOpen(ws);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (e) {
      console.error('Failed to parse WebSocket message:', event.data);
    }
  };

  ws.onclose = () => onClose?.();
  ws.onerror = (err) => onError?.(err);

  return ws;
}
