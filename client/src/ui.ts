const ui = {
  chatBox: null as HTMLDivElement | null,
  chatInput: null as HTMLInputElement | null,
  sendBtn: null as HTMLButtonElement | null,
};

export function initChatUI(onSendMessage: (message: string) => void) {
  const chatBox = document.getElementById('chat-box') as HTMLDivElement;
  const chatInput = document.getElementById('chat-input') as HTMLInputElement;
  const sendBtn = document.getElementById('chat-send') as HTMLButtonElement;

  if (!chatBox || !chatInput || !sendBtn) {
    console.error('채팅 UI 요소를 찾을 수 없습니다.');
    return;
  }

  // --- 추가된 디버깅 코드 ---
  // initChatUI 함수가 `onSendMessage`로 무엇을 받았는지 명확히 확인합니다.
  console.log('[클라이언트 UI] initChatUI가 콜백으로 받은 onSendMessage:', onSendMessage);

  if (typeof onSendMessage !== 'function') {
    console.error(
      '[클라이언트 UI] 심각한 오류: onSendMessage 콜백이 함수가 아닙니다! 현재 타입:',
      typeof onSendMessage
    );
    alert('오류: 채팅 보내기 기능이 초기화되지 않았습니다. 콘솔을 확인하세요.');
    return; // 함수가 아니므로 더 이상 진행하지 않음
  }
  // --- 디버깅 코드 끝 ---

  console.log('[클라이언트 UI] 채팅 UI 초기화 완료. 버튼에 이벤트 리스너를 추가합니다.');

  const sendMessage = () => {
    console.log('[클라이언트 UI] "보내기" 버튼 클릭됨 / Enter 키 입력됨.');
    const message = chatInput.value.trim();
    if (message) {
      onSendMessage(message);
      chatInput.value = '';
    } else {
      console.log('[클라이언트 UI] 메시지가 비어있어 전송하지 않음.');
    }
  };

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
}

export function addMessageToBox(from: string, message: string, isMine: boolean) {
  const chatBox = document.getElementById('chat-box') as HTMLDivElement;
  if (!chatBox) return;

  const msgElement = document.createElement('div');
  // **수정**: 이제 ID 대신 사용자 이름(임시로 ID)과 메시지만 표시
  msgElement.textContent = `${isMine ? '나' : from}: ${message}`;

  // 내 메시지인지 여부에 따라 다른 CSS 클래스 적용
  msgElement.className = isMine ? 'my-message' : 'other-message';

  chatBox.appendChild(msgElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}
