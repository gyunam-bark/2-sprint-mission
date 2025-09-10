import { initGame } from './game';
import { initChat } from './chat';

/**
 * 로그인 UI를 초기화하고 이벤트 리스너를 설정합니다.
 */
export function initAuth(): void {
  // --- 요소 선택 부분 수정 ---
  const signinBtn = document.getElementById('signin') as HTMLButtonElement | null;
  const usernameInput = document.getElementById('username') as HTMLInputElement | null;
  const passwordInput = document.getElementById('password') as HTMLInputElement | null;

  // CHANGED: id='authForm' -> class='login-form'
  const authForm = document.querySelector('.login-form') as HTMLDivElement | null;
  // CHANGED: id='gameContainer' -> class='game-container'
  const gameContainer = document.querySelector('.game-container') as HTMLDivElement | null;

  // HTML에 없는 authStatus 관련 코드는 제거했습니다.

  if (!signinBtn || !usernameInput || !passwordInput || !authForm || !gameContainer) {
    // 에러 메시지를 더 구체적으로 변경
    console.error('UI 요소를 찾을 수 없습니다. HTML의 id나 class 이름을 확인해주세요.');
    return;
  }

  // 로그인 성공 시 게임 영역이 보이도록 초기에 숨김
  gameContainer.style.display = 'none';

  // 로그인 시도
  signinBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      alert('Username과 Password를 입력하세요.');
      return;
    }

    try {
      const success = await trySignIn(username, password);

      if (success) {
        alert('로그인 성공!');

        // 로그인 UI 숨기고 게임 UI 표시
        authForm.style.display = 'none';
        gameContainer.style.display = 'block';

        // 게임과 채팅 초기화
        initGame();
        initChat();
      }
    } catch (err) {
      console.error(err);
      alert('로그인 실패: ' + (err as Error).message);
    }
  });
}

async function trySignIn(username: string, password: string): Promise<boolean> {
  let response = await fetch('http://localhost:3000/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  let data = await response.json();

  if (!response.ok || !data.success) {
    console.warn('로그인 실패 → 회원가입을 시도합니다.');
    try {
      await trySignUp(username, password);
      response = await fetch('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message ?? '회원가입 후 로그인에 실패했습니다.');
      }
    } catch (err) {
      alert((err as Error).message);
      return false;
    }
  }

  if (data.data.accessToken && data.data.refreshToken) {
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    return true;
  } else {
    throw new Error('로그인은 성공했지만 서버로부터 토큰을 받지 못했습니다.');
  }
}

async function trySignUp(username: string, password: string): Promise<void> {
  const response = await fetch('http://localhost:3000/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error?.message ?? '회원가입에 실패했습니다.');
  }
  console.log('회원가입 성공!');
}
