import { gameState, setMyPlayer } from './state';
import { sendMoveUpdate } from './network';

const keys: Record<string, boolean> = {};

function canMove(x: number, y: number): boolean {
  const mapX = Math.floor(x);
  const mapY = Math.floor(y);
  return gameState.mapData[mapY]?.[mapX] !== 1;
}

export function handleKeyboardInput() {
  let moved = false;
  const { me } = gameState;
  const step = 0.05;
  const turn = 0.05;

  let newX = me.x,
    newY = me.y,
    newDir = me.dir;

  if (keys['a']) {
    newDir -= turn;
    moved = true;
  }
  if (keys['d']) {
    newDir += turn;
    moved = true;
  }
  if (keys['w']) {
    const nx = me.x + Math.cos(me.dir) * step;
    const ny = me.y + Math.sin(me.dir) * step;
    if (canMove(nx, ny)) {
      newX = nx;
      newY = ny;
      moved = true;
    }
  }
  if (keys['s']) {
    const nx = me.x - Math.cos(me.dir) * step;
    const ny = me.y - Math.sin(me.dir) * step;
    if (canMove(nx, ny)) {
      newX = nx;
      newY = ny;
      moved = true;
    }
  }

  if (moved) {
    setMyPlayer({ x: newX, y: newY, dir: newDir });
    sendMoveUpdate(gameState.me);
  }
}

export function initInputHandlers(canvas: HTMLCanvasElement) {
  window.addEventListener('keydown', (e) => (keys[e.key.toLowerCase()] = true));
  window.addEventListener('keyup', (e) => (keys[e.key.toLowerCase()] = false));

  canvas.addEventListener('click', () => canvas.requestPointerLock());

  document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === canvas) {
      const newDir = gameState.me.dir + e.movementX * 0.002;
      setMyPlayer({ dir: newDir });
      sendMoveUpdate(gameState.me);
    }
  });
}
