import { GameStatus, Territory } from "../types/gameTypes.ts";

// {
//     status: "running",
//     userId: "1",
//     players: [
//       {
//         id: "1",
//         username: "siya",
//         colour: "red",
//         avatar:
//           "url",
//       },
//       {
//         id: "2",
//         username: "shikha",
//         colour: "green",
//         avatar:
//           "url",
//       },
//     ],
//     actions: [
//       {
//         id: "1",
//         name: "intialDeploymentStart",
//         playerId: null,
//         currentPlayerTurn: null,
//         data: {
//           troopsCount: 11
//         },
//         timestamp: Date.now(),
//         territoryState: {
//           india: {
//             troops: 23,
//             owner: "1",
//           },
//           china: {
//             troops: 99,
//             owner: "2",
//           },
//         },
//       },
//     ],
//   },

type Data = {
  [key: string]:
    | number
    | Record<string, string>
    | string
    | Record<string, PlayerState>;
};

type Continent = { name: string; extraTroops: number };
type MadhaviContinent = Record<string, string[]>;

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
  };
  currentPlayer: string;
  playerStates: Record<string, PlayerState>;
  territoryState: Record<string, Territory>;
  timeStamp: number;
}

export interface ActionDetails {
  playerId: string;
  name: string;
  data: Record<string, number | string>;
}

export interface Player {
  id: string;
  colour: string;
}

export default class Game {
  private currentPlayer: string = "";
  private players: Set<string>;
  private gameStatus: GameStatus;
  private actions: Action[] = [];
  private continents: Record<string, string[]>;
  private shuffler: (arr: string[]) => string[];
  private playerStates: Record<string, PlayerState> = {};
  private territoryState: Record<string, Territory> = {};
  private uniqueId;
  private timeStamp;
  private playerDetails: Player[] = [];
  private colours: string[];
  private connectedTerritories: MadhaviContinent;

  constructor(
    players: Set<string>,
    continents: Record<string, string[]>,
    uniqueId: () => string,
    shuffler: (arr: string[]) => string[],
    timeStamp: () => number,
    connectedTerritories: MadhaviContinent,
    colours: string[] = ["red", "green", "yellow", "black", "brown", "grey"]
  ) {
    this.players = players;
    this.continents = continents;
    this.gameStatus = GameStatus.running;
    this.shuffler = shuffler;
    this.uniqueId = uniqueId;
    this.timeStamp = timeStamp;
    this.colours = colours;
    this.connectedTerritories = connectedTerritories;
  }

  get gameActions() {
    return this.actions;
  }

  private selectPlayerTurn(noOfPlayers: number) {
    let i = 0;
    return () => {
      return this.playerDetails[i++ % noOfPlayers];
    };
  }

  private initializePlayerStates() {
    const players = [...this.players];
    const territoriesByPlayer: Record<string, string[]> = {};
    const playerStates: Record<string, PlayerState> = {};

    for (const [territory, { owner }] of Object.entries(this.territoryState)) {
      if (!(owner in territoriesByPlayer)) {
        territoriesByPlayer[owner] = [];
      }

      territoriesByPlayer[owner].push(territory);
    }

    players.forEach((playerId) => {
      playerStates[playerId] = {
        territories: territoriesByPlayer[playerId] || [],
        continents: [],
        availableTroops: 21,
        cards: [],
      };
    });

    return playerStates;
  }

  private divideTerritories(
    continents: Record<string, string[]>,
    playerSet: Set<string>
  ): Record<string, Territory> {
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
  }

  private generateAction(
    userId: string,
    data: Data,
    action: string,
    playerId: string | null,
    to: string | null
  ) {
    return {
      id: this.uniqueId(),
      name: action,
      playerId,
      to,
      currentPlayer: userId,
      data: data,
      timeStamp: this.timeStamp(),
      playerStates: this.playerStates,
      territoryState: this.territoryState,
    };
  }

  public updateTroops(actionDetails: ActionDetails) {
    const { territory, troopCount } = actionDetails.data;
    const playerId = actionDetails.playerId;

    if (!(territory in this.territoryState)) {
      return null;
    }

    this.territoryState[territory].troops += Number(troopCount);
    this.playerStates[playerId].availableTroops -= Number(troopCount);

    this.actions.push(
      this.generateAction(
        playerId,
        {
          territory: territory,
          troopCount: this.territoryState[territory].troops,
          troopDeployed: troopCount,
        },
        "updateTroops",
        null,
        null
      )
    );

    return {
      territory: this.territoryState[territory],
      player: this.playerStates[playerId],
    };
  }

  public hasPlayer(playerId: string) {
    return this.players.has(playerId);
  }

  private isDeploymentOver() {
    const status = Object.values(this.playerStates).every(
      ({ availableTroops }) => availableTroops === 0
    );
    return status;
  }

  public startGame() {
    const status = this.isDeploymentOver();

    if (!status) {
      return { status };
    }

    this.actions.push(this.generateAction("", {}, "startGame", null, null));
    const playerCycle = this.selectPlayerTurn(3);
    this.currentPlayer = playerCycle().id;
    this.actions.push(
      this.generateAction(
        this.currentPlayer,
        {},
        "reinforcementPhase",
        this.currentPlayer,
        this.currentPlayer
      )
    );
    return { status };
  }

  get status() {
    return this.gameStatus;
  }

  public init() {
    this.territoryState = this.divideTerritories(this.continents, this.players);
    this.playerStates = this.initializePlayerStates();
    this.playerDetails = [...this.players].map((player, index) => {
      return { id: player, colour: this.colours[index] };
    });

    this.actions.push(
      this.generateAction(
        "",
        { troopCount: 21 },
        "startInitialDeployment",
        null,
        null
      )
    );

    return {
      territories: this.territoryState,
      players: this.playerStates,
      actions: this.actions,
    };
  }

  get lastAction() {
    return this.actions.at(-1);
  }

  private updateTroopsToBeCollected(
    territories: string[],
    continents: Continent[]
  ) {
    const territoryTroops = Math.floor(territories.length / 3);
    const totalTerritoryTroops = territoryTroops < 3 ? 3 : territoryTroops;
    const continentTroops = continents.reduce(
      (sum, { extraTroops }) => extraTroops + sum,
      0
    );

    return totalTerritoryTroops + continentTroops;
  }

  public fetchReinforcementData(actionDetails: ActionDetails) {
    const { playerId } = actionDetails;
    const territories = this.playerTerritories(playerId);
    const continents = this.playerStates[playerId].continents;
    const newTroops = this.updateTroopsToBeCollected(territories, continents);

    return {
      territories,
      newTroops,
    };
  }

  public playerTerritories(playerId: string) {
    return this.playerStates[playerId].territories;
  }

  public getPlayerCards(playerId: string) {
    return this.playerStates[playerId].cards;
  }

  get playerState() {
    return this.playerStates;
  }

  public neighbouringTerritories(
    playerId: string,
    attackingTerritory: string | number
  ) {
    const neighbouring = this.connectedTerritories[attackingTerritory];
    const connectedterr = neighbouring.filter((territory) => {
      return Object.entries(this.territoryState).filter((territoryState) => {
        return (
          territoryState[1].owner !== playerId &&
          territoryState[0] === territory
        );
      })[0];
    });

    return connectedterr;
  }

  private getDefenderID(defender: [string, Territory] | undefined) {
    if (defender === undefined) {
      return "player not found";
    }

    return defender[1].owner;
  }

  public gameDefender(defendingTerritory: string | number) {
    const defender = Object.entries(this.territoryState).find((territory) => {
      return territory[0] === defendingTerritory;
    });

    return this.getDefenderID(defender);
  }

  get playersData() {
    return [...this.playerDetails];
  }
}
