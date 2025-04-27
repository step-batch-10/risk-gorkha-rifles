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
  storeTroops = "storeTroops",
  fortification = "fortification",
  connectedTerritories = "connectedTerritories",
  startFortification = "startFortification",
  getGamePlayers = "getGamePlayers"
}

export type AttackDetails = { troops: number | string; attackerId: string };
export type DefendDetails = { troops: number | string; defenderId: string };

export type DiceDetails = [AttackDetails | DefendDetails];

export type Continent = Record<string, string[]>;

export type Territory = { owner: string; troops: number };

export type CardType = "infantry" | "cavalry" | "artillery" | "hybrid";

export type PlayerState = {
  territories: string[];
  continents: Continent[];
  availableTroops: number;
  cards: string[];
};

export interface Action {
  id: string;
  name: string;
  playerId: string | null;
  to: string | null;
  data: {
    territory?: string;
    troopCount?: number;
    initialState?: Record<string, PlayerState>;
    territoryTroops?: number;
    playerTroops?: number;
    diceDetails?: number[];
    activeTerritories?: string[];
    troopDeployed?: number;
  };
  currentPlayer: string;
  playerStates: PlayerStates;
  territoryState: Record<string, Territory>;
  timeStamp: number;
}

export type FortificationDetails = {
  from: string;
  to: string;
  troopsCount: number;
};

export type Data = {
  [key: string]:
    | number
    | Record<string, string>
    | string
    | Record<string, PlayerState>
    | number[]
    | string[];
};

export type TerritoryState = Record<string, Territory>;

export interface IncomingActionDetails {
  playerId: string;
  name: string;
  data: Record<string, number | string>;
}

export interface OutgoingActionDetails {
  playerId: string;
  data: Data;
  action: string;
  currentPlayerId: string;
  to: string | null;
  playerStates: PlayerStates;
  territoryState: TerritoryState;
}

export type PlayerStates = Record<string, PlayerState>;
