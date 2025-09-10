// src/renderer.ts

import { gameState } from './state';

let ctx: CanvasRenderingContext2D;
let canvas: HTMLCanvasElement;

export function initRenderer(_canvas: HTMLCanvasElement) {
  canvas = _canvas;
  ctx = canvas.getContext('2d')!;
  canvas.width = 640;
  canvas.height = 400;
}

function drawFloorAndCeiling() {
  ctx.fillStyle = '#87CEEB'; // 천장
  ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
  ctx.fillStyle = '#444'; // 바닥
  ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
}

function drawWalls() {
  const { me, mapData } = gameState;
  const fov = Math.PI / 3;

  for (let i = 0; i < canvas.width; i++) {
    const rayAngle = me.dir - fov / 2 + (i / canvas.width) * fov;
    let distance = 0;
    let hit = false;

    while (!hit && distance < 20) {
      distance += 0.05;
      const hitX = me.x + Math.cos(rayAngle) * distance;
      const hitY = me.y + Math.sin(rayAngle) * distance;
      if (mapData[Math.floor(hitY)]?.[Math.floor(hitX)] === 1) {
        hit = true;
      }
    }

    if (hit) {
      const correctedDistance = distance * Math.cos(rayAngle - me.dir);
      const wallHeight = (1 / correctedDistance) * 300;
      const brightness = Math.max(0.2, 1 - distance / 10);
      const wallShade = Math.floor(136 * brightness);
      ctx.fillStyle = `rgb(${wallShade}, ${wallShade}, ${wallShade})`;
      ctx.fillRect(i, canvas.height / 2 - wallHeight / 2, 1, wallHeight);
    }
  }
}

function drawOtherPlayers() {
  const { me, otherPlayers } = gameState;
  const fov = Math.PI / 3;
  ctx.fillStyle = 'red';

  for (const id in otherPlayers) {
    const p = otherPlayers[id];
    const dx = p.x - me.x;
    const dy = p.y - me.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) - me.dir;

    if (Math.abs(angle) < fov / 1.5) {
      const screenX = canvas.width / 2 + Math.tan(angle) * (canvas.width / 2);
      const size = 50 / dist;
      ctx.fillRect(screenX - size / 2, canvas.height / 2 - size / 2, size, size);
    }
  }
}

export function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFloorAndCeiling();
  drawWalls();
  drawOtherPlayers();
}
