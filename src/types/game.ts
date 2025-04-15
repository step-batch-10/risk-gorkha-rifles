export enum GameStatus {
  waiting = "waiting",
  running = "running",
};

export type Territory = { owner: string, troops: number; };
export type TerritoryState = Record<string, Territory>;
