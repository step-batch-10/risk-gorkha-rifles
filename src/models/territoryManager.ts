import { PlayerRegions, Shuffler, Territory as TerritoryTS, TerritoryState } from "../types/gameTypes.ts";

export type Territory = {
  neighbourTerritories: string[];
};

export type Continent = {
  bonusPoints: number;
  territories: Record<string, Territory>;
};

export type Continents = Record<string, Continent>;

export type AdjacentTerritories = Record<string, string[]>;

export default class TerritoryManager {
  private continents: Continents;
  private adjacentTerritories: AdjacentTerritories = {};
  private territoryState: TerritoryState = {};
  private shuffler: Shuffler;

  constructor(
    continents: Continents,
    shuffler: Shuffler = (territories: string[]) => [...territories]) {
    this.shuffler = shuffler;
    this.continents = continents;
  }

  private allTerritories = (): string[] => {
    const territories: string[] = [];

    Object.keys(this.continents).forEach(territory => {
      const continentTerritories = Object.keys(this.continents[territory].territories);
      territories.push(...continentTerritories);
    });

    return territories;
  };

  private distributeTerritories(players: string[]): TerritoryState {
    const territoryState: Record<string, TerritoryTS> = {};
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

  private getAdajacentTerritories() {
    const adjacentTerritories: Record<string, string[]> = {};

    for (const continent in this.continents) {
      const continentTerritories = this.continents[continent].territories;

      for (const territory in continentTerritories) {
        const territories = continentTerritories[territory];
        adjacentTerritories[territory] = territories.neighbourTerritories;
      }
    }

    return adjacentTerritories;
  }

  public initialize(players: Set<string>): TerritoryState {
    this.adjacentTerritories = this.getAdajacentTerritories();

    return this.distributeTerritories([...players]);
  }

  public getTerritoryState(): TerritoryState {
    return this.territoryState;
  }

  private isValidTerritory(territory: string) {
    return territory in this.territoryState;
  }

  private isValidContinent(continent: string) {
    return continent in this.continents;
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
      const continentTerritories = Object.keys(this.continents[continent].territories);

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

  public getContinentBonus(continent: string) {
    if (!this.isValidContinent(continent))
      throw new Error("Invalid continent");

    return this.continents[continent].bonusPoints;
  }

  private getTerritoryOwners(): Record<string, string> {
    return Object.entries(this.territoryState).reduce((owners, [territory, data]) => {
      owners[territory] = data.owner;
      return owners;
    }, {} as Record<string, string>);
  }

  private exploreConnectedTerritories(
    adjacencyMap: Record<string, string[]>,
    current: string,
    visited: Set<string>,
    territoryOwners: Record<string, string>,
    targetOwner: string
  ): void {
    visited.add(current);

    for (const neighbor of adjacencyMap[current]) {
      const isUnvisitedSameOwner =
        territoryOwners[neighbor] === targetOwner && !visited.has(neighbor);

      if (isUnvisitedSameOwner) {
        this.exploreConnectedTerritories(adjacencyMap, neighbor, visited, territoryOwners, targetOwner);
      }
    }
  }

  public getConnectedTerritories(startTerritory: string): string[] {
    if (!this.isValidTerritory(startTerritory))
      throw new Error(`Territory "${startTerritory}" not found.`);

    const targetOwner = this.territoryState[startTerritory].owner;
    const territoryOwners = this.getTerritoryOwners();
    const visited = new Set<string>();

    this.exploreConnectedTerritories(this.adjacentTerritories, startTerritory, visited, territoryOwners, targetOwner);

    visited.delete(startTerritory);

    return [...visited];
  }

  public getNeighbouringTerritories(territory: string): string[] {
    const territoryOwner = this.territoryState[territory].owner;
    const neighbouringTerritories = this.adjacentTerritories[territory];

    const notOwnedNeighbours = neighbouringTerritories.filter(neighbourTerritory => {
      const territoryState = this.territoryState[neighbourTerritory];

      return territoryState.owner !== territoryOwner;
    });

    return notOwnedNeighbours;
  }
}