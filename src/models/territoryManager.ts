import { Continent, Shuffler, Territory, TerritoryState } from "../types/gameTypes.ts";

export default class TerritoryManager {
  private continents: Continent;
  private neighboringTerritories: Continent;
  private territoryState: TerritoryState = {};
  private shuffler: Shuffler;

  constructor(
    continents: Continent,
    neighboringTerritories: Continent,
    shuffler: Shuffler = (territories: string[]) => [...territories]) {
    this.shuffler = shuffler;
    this.continents = continents;
    this.neighboringTerritories = neighboringTerritories;
  }

  private distributeTerritories(players: string[]): TerritoryState {
    const territoryState: Record<string, Territory> = {};
    const territoriesList = Object.values(this.continents).flatMap((x) => x);
    const shuffled: string[] = this.shuffler(territoriesList);

    shuffled.forEach((territory, index) => {
      territoryState[territory] = {
        owner: players[index % players.length],
        troops: 1,
      };
    });

    this.territoryState = territoryState;
    return this.territoryState;
  }

  public initialize(players: Set<string>): TerritoryState {
    return this.distributeTerritories([...players]);
  }
}