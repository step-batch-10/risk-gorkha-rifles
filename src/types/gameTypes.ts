export enum GameStatus {
  over = "over",
  running = "running",
}

export enum AllotStatus {
  waitingLobby = "waitingLobby",
  gameRoom = "gameRoom",
}

export type LobbyStatus = { status: boolean; players: string[] };

export enum ActionTypes {
  updateTroops = "updateTroops",
  startGame = "startGame",
  reinforceRequest = "reinforceRequest",
  getCards = "getCards",
  requestAttack = "requestAttack",
  requestNeighbouringTerritories = "requestNeighbouringTerritories",
  requestDefendingPlayer = "requestDefendingPlayer",
}

export type Continent = Record<string, string[]>;

export type Territory = { owner: string; troops: number };

export type CardType = "infantry" | "cavalry" | "artillery" | "hybrid";
