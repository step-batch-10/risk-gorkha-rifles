import { TerritoryState } from "../types/gameTypes.ts";
import { PlayerState } from "./game.ts";

type ContinentData = { name: string; extraTroops: number };

export class PlayerStates {
  private playerStates: Record<string, PlayerState>;

  constructor() {
    this.playerStates = {};
  }

  public initializePlayerStates(
    players: string[],
    territoryState: TerritoryState
  ) {
    const territoriesByPlayer: Record<string, string[]> = {};

    for (const [territory, { owner }] of Object.entries(territoryState)) {
      if (!(owner in territoriesByPlayer)) {
        territoriesByPlayer[owner] = [];
      }

      territoriesByPlayer[owner].push(territory);
    }

    players.forEach((playerId) => {
      this.playerStates[playerId] = {
        territories: territoriesByPlayer[playerId],
        continents: [],
        availableTroops: 21,
        cards: [],
      };
    });

    return this.playerStates;
  }

  get getPlayerStates() {
    return { ...this.playerStates };
  }

  public upadteTroops(playerId: string, troops: number) {
    this.playerStates[playerId].availableTroops -= troops;
    return this.playerStates[playerId];
  }

  private extractReinforcements(
    territories: string[],
    continents: ContinentData[]
  ) {
    const territoryTroops = Math.floor(territories.length / 3);
    const totalTerritoryTroops = territoryTroops < 3 ? 3 : territoryTroops;
    const continentTroops = continents.reduce(
      (sum, { extraTroops }) => extraTroops + sum,
      0
    );

    return totalTerritoryTroops + continentTroops;
  }

  public fetchReinforcements(playerId: string) {
    const territories = this.playerStates[playerId].territories;
    const continents = this.playerStates[playerId].continents;
    const newTroops = this.extractReinforcements(territories, continents);
    return { territories, newTroops };
  }

  public playerState(playerId: string) {
    return this.playerStates[playerId];
  }

  public addTerritory(playerId: string, territory: string) {
    this.playerStates[playerId].territories.push(territory);
    return this.playerStates[playerId].territories;
  }

  public removeTerritory(playerId: string, territory: string) {
    const territoryIndex =
      this.playerStates[playerId].territories.indexOf(territory);
    this.playerStates[playerId].territories.splice(territoryIndex, 1);
    return this.playerStates[playerId].territories;
  }

  public addContinent(playerId: string, continent: ContinentData) {
    this.playerStates[playerId].continents.push(continent);
    return this.playerStates[playerId].continents;
  }

  public removeContinent(playerId: string, continent: string) {
    const continentIndex = this.playerStates[playerId].continents.findIndex(
      (cont) => cont.name === continent
    );
    this.playerStates[playerId].continents.splice(continentIndex, 1);
    return this.playerStates[playerId].continents;
  }

  public addCard(playerId: string, card: string) {
    this.playerStates[playerId].cards.push(card);
    return this.playerStates[playerId].cards;
  }

  public deductCards(playerId: string, cards: string[]) {
    this.playerStates[playerId].cards = this.playerStates[
      playerId
    ].cards.filter((card) => !cards.includes(card));

    return this.playerStates[playerId].cards;
  }
}
