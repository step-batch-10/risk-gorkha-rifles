import { TerritoryState } from "../types/game.ts";
import { divideTerritories, getContinents } from "../utils/territory.ts";

export default class Risk {
  public players: Record<string, string>;
  public territoryState: TerritoryState;

  constructor() {
    this.players = {};
    this.territoryState = {};
  }

  public addPlayer(playerId: string, playerName: string) {
    this.players[playerId] = playerName;
  }

  public init() {
    if (Object.keys(this.players).length !== 6) return;

    const continents = getContinents();
    const territories = divideTerritories(continents, Object.keys(this.players));

    this.territoryState = territories;
  }
}
