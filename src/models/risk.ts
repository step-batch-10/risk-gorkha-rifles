import { Territory } from '../types/game.ts';
import { divideTerritories, getContinents } from '../utils/territory.ts';

export default class Risk {
  public players: Map<string, string>;
  public territoryState: Map<string, Territory>;

  constructor() {
    this.players = new Map<string, string>();
    this.territoryState = new Map();
  }

  public addPlayer(playerId: string, playerName: string) {
    this.players.set(playerId, playerName);
    // console.log(this.players);
  }

  public init() {
    // console.log(this.players.size);
    if (this.players.size !== 6) return;

    const continents = getContinents();
    const territories = divideTerritories(
      continents,
      // Object.keys(this.players)
      Array.from(this.players.keys())
    );

    this.territoryState = territories;
  }
}
