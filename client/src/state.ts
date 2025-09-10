import { Player, MapData } from './types';

// 게임의 모든 상태를 포함하는 객체
export const gameState = {
  me: { id: '', x: 0, y: 0, dir: 0 } as Player,
  otherPlayers: {} as Record<string, Player>,
  mapData: [] as MapData,
};

// 내 플레이어 정보 설정
export function setMyPlayer(player: Partial<Player>) {
  gameState.me = { ...gameState.me, ...player };
}

// 다른 플레이어 추가 또는 업데이트
export function addOrUpdateOtherPlayer(player: Player) {
  if (player.id === gameState.me.id) return;
  gameState.otherPlayers[player.id] = player;
}

// 다른 플레이어 제거
export function removeOtherPlayer(playerId: string) {
  delete gameState.otherPlayers[playerId];
}

// 맵 데이터 설정 및 시작 위치 계산
export function setMapData(mapData: MapData) {
  gameState.mapData = mapData;
  for (let y = 0; y < mapData.length; y++) {
    for (let x = 0; x < mapData[y].length; x++) {
      if (mapData[y][x] === 2) {
        setMyPlayer({ x: x + 0.5, y: y + 0.5 });
        return;
      }
    }
  }
}
