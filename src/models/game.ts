import { GameStatus, Territory } from "../types/game.ts";

export interface Action {
  id: string;
  name: string;
  playerId: string | null;
  data: unknown;
  currentPlayer: string;
  territoryState: Record<string, Territory>;
  timeStamp: number;
}

export default class Game {
  private players: Set<string>;
  private gameStatus: GameStatus;
  private actions: Action[] = [];
  private continents: Record<string, string[]>;
  private shuffler: (arr: string[]) => string[];
  private territoryState: Record<string, Territory> = {};
  private uniqueId;
  private timeStamp;

  constructor(
    players: Set<string>,
    continents: Record<string, string[]>,
    uniqueId: () => string,
    shuffler: (arr: string[]) => string[],
    timeStamp: () => number
  ) {
    this.players = players;
    this.continents = continents;
    this.gameStatus = GameStatus.running;
    this.shuffler = shuffler;
    this.uniqueId = uniqueId;
    this.timeStamp = timeStamp;
  }

  get gameActions() {
    return this.actions;
  }

  private divideTerritories = (
    continents: Record<string, string[]>,
    playerSet: Set<string>
  ): Record<string, Territory> => {
    const territories: Record<string, Territory> = {};
    const totalPlayers = playerSet.size;
    const players = [...playerSet];

    const territoriesList = Object.values(continents).flatMap((x) => x);
    const shuffled: string[] = this.shuffler(territoriesList);

    shuffled.forEach((territory, index) => {
      territories[territory] = {
        owner: players[index % totalPlayers],
        troops: 1,
      };
    });

    return territories;
  };

  private generateAction(
    playerId: string,
    data: { [key: string]: number },
    action: string,
    to: string | null
  ) {
    return {
      id: this.uniqueId(),
      name: action,
      playerId: to,
      currentPlayer: playerId,
      data: data,
      timeStamp: this.timeStamp(),
      territoryState: this.territoryState,
    };
  }

  public updateTerritoryTroops(territory: string, troopCount: number) {
    if (!(territory in this.territoryState)) {
      return null;
    }

    this.territoryState[territory].troops += troopCount;
    return this.territoryState[territory];
  }

  public hasPlayer(playerId: string) {
    return this.players.has(playerId);
  }

  get status() {
    return this.gameStatus;
  }

  public init() {
    const territories = this.divideTerritories(this.continents, this.players);
    this.territoryState = territories;

    this.actions.push(
      this.generateAction(
        "",
        { troopsCount: 21 },
        "initialDeploymentStart",
        null
      )
    );

    return this.territoryState;
  }

  get lastAction() {
    return this.actions.at(-1);
  }

  get allPlayers() {
    return [...this.players];
  }
}
