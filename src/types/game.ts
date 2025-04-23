export enum GameStatus {
  over = "over",
  running = "running",
}

export enum AllotStatus {
  waitingLobby = "waitingLobby",
  gameRoom = "gameRoom",
}

export type Continent = Record<string, string[]>;

export type Territory = { owner: string; troops: number };
