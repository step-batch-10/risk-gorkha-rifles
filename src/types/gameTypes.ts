export enum GameStatus {
  over = 'over',
  running = 'running',
}

export enum AllotStatus {
  waitingLobby = 'waitingLobby',
  gameRoom = 'gameRoom',
}

export type LobbyStatus = { status: boolean; players: string[] };

export enum ActionTypes {
  updateTroops = 'updateTroops',
  isDeploymentOver = 'isDeploymentOver',
  reinforceRequest = 'reinforceRequest',
  attackRequest = 'attackRequest',
}

export type Continent = Record<string, string[]>;

export type Territory = { owner: string; troops: number };
