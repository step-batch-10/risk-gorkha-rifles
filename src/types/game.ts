export enum GameStatus {
  over = "over",
  running = "running",
}

export type Continent = Record<string, string[]>;

export type Territory = { owner: string; troops: number };
