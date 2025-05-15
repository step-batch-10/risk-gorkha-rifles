import { Continents, PlayerRegions, Shuffler, Territory, TerritoryState } from "../types/gameTypes.ts";

export default class TerritoryManager {
  private continents: Continents;
  private neighboringTerritories: Continents;
  private territoryState: TerritoryState = {};
  private shuffler: Shuffler;

  constructor(
    continents: Continents,
    neighboringTerritories: Continents,
    shuffler: Shuffler = (territories: string[]) => [...territories]) {
    this.shuffler = shuffler;
    this.continents = continents;
    this.neighboringTerritories = neighboringTerritories;
  }

  private allTerritories = () => {
    const territories: string[] = [];

    Object.keys(this.continents).forEach(territory => {
      const continentTerritories = this.continents[territory].territories;
      territories.push(...continentTerritories);
    });

    return territories;
  };

  private distributeTerritories(players: string[]): TerritoryState {
    const territoryState: Record<string, Territory> = {};
    const territoriesList = this.allTerritories();
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

  public getTerritoryState(): TerritoryState {
    return this.territoryState;
  }

  private isValidTerritory(territory: string) {
    return territory in this.territoryState;
  }

  public updateTroops(territory: string, troopsCount: number) {
    if (!this.isValidTerritory(territory))
      throw new Error('Invalid territory');

    const updatedTroops = this.territoryState[territory].troops += troopsCount;
    this.territoryState[territory].troops = updatedTroops <= 0 ? 0 : updatedTroops;

    return this.territoryState[territory].troops;
  }

  private playerContinents(player: string) {
    const playerTerritories = this.playerTerritories(player);

    return Object.keys(this.continents).filter(continent => {
      const continentTerritories = this.continents[continent].territories;

      return continentTerritories.every(
        territory => playerTerritories.includes(territory));
    });
  }

  private playerTerritories(player: string) {
    return Object.keys(this.territoryState)
      .filter(territory => this.territoryState[territory].owner === player);
  }

  public getPlayerRegions(player: string): PlayerRegions {
    return {
      territories: this.playerTerritories(player),
      continents: this.playerContinents(player)
    };
  }
}