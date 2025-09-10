import { fetchMapData } from './api';
import { setMapData } from './state';
import { initWebSocket } from './network';
import { initRenderer, render } from './renderer';
import { initInputHandlers, handleKeyboardInput } from './input';

export async function initGame(): Promise<void> {
  try {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

    // 1. 맵 데이터 로드 및 상태 초기화
    const mapData = await fetchMapData();
    setMapData(mapData);

    // 2. 모듈 초기화
    initRenderer(canvas);
    initInputHandlers(canvas);
    initWebSocket();

    // 3. 메인 게임 루프 시작
    function gameLoop() {
      handleKeyboardInput(); // 키보드 입력 처리
      render(); // 화면 렌더링
      requestAnimationFrame(gameLoop);
    }
    gameLoop();
  } catch (error) {
    alert((error as Error).message);
    console.error('Failed to initialize game:', error);
  }
}
