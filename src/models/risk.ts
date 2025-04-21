import { Territory } from "../types/game.ts";
import { divideTerritories, getContinents } from "../utils/territory.ts";
import { playersAndTroops } from "../utils/players.ts";
import _ from "npm:lodash";

export interface PlayerDetails {
  name: string;
  colour: string;
  avatar: string;
  playerId: string;
}

interface PlayerProfile {
  colour: string;
  avatar: string;
}

const playerProfileData: PlayerProfile[] = [
  {
    colour: "red",
    avatar:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
  },
  {
    colour: "yellow",
    avatar:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
  },
  {
    colour: "blue",
    avatar:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
  },
  {
    colour: "violet",
    avatar:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
  },
  {
    colour: "orange",
    avatar:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
  },
  {
    colour: "pink",
    avatar:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
  },
];

//
//   initialDeploymentStart: {
//     status: "running",
//     userId: "1",
//     players: [
//       {
//         id: "1",
//         name: "siya",
//         colour: "red",
//         avatar:
//           "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
//       },
//       {
//         id: "2",
//         name: "shikha",
//         colour: "green",
//         avatar:
//           "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
//       },
//     ],
//     actions: [
//       {
//         id: "1",
//         name: "intialDeploymentStart",
//         playerId: null,
//         currentPlayerTurn: "2",
//         data: null,
//         timestamp: Date.now(),
//         territoryState: {
//           india: {
//             troops: 23,
//             owner: "2",
//           },
//           china: {
//             troops: 99,
//             owner: "1",
//           },
//         },
//       },
//     ],
//   },
// };

export interface Action {
  id: string;
  name: string;
  playerId: string | null;
  data: unknown;
  currentPlayer: string;
  territoryState: Map<string, Territory>;
  timeStamp: number;
}

export default class Risk {
  private troopsDeployed: Array<number>;
  private uniqueId: () => string;
  public players: PlayerDetails[];
  public territoryState: Map<string, Territory>;
  private playerProfile;
  public actions: Action[] = [];
  private noOfPlayers: number;

  constructor(
    noOfPlayers: number,
    generateId: () => string,
    playerProfile = playerProfileData
  ) {
    this.troopsDeployed = [];
    this.players = [];
    this.territoryState = new Map();
    this.playerProfile = playerProfile;
    this.uniqueId = generateId;
    this.noOfPlayers = noOfPlayers;
  }

  public addPlayer(playerId: string, playerName: string) {
    const index = this.players.length;
    const profile = this.playerProfile.at(index);

    const { colour, avatar } = profile || {
      colour: "gold",
      avatar:
        "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
    };

    this.players.push({
      name: playerName,
      colour,
      avatar,
      playerId: playerId,
    });
  }

  private isDeploymentOver() {
    const totalTroops = playersAndTroops();
    return (
      _.sum(this.troopsDeployed) ===
      totalTroops[this.noOfPlayers].totalNumberOfTroops
    );
  }

  private updateAction(
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
      timeStamp: Date.now(),
      territoryState: this.territoryState,
    };
  }

  public deployTroops(
    playerId: string,
    territory: string,
    troopsCount: number
  ) {
    const territoryData = this.territoryState.get(territory) ?? { troops: 0 };

    territoryData.troops += troopsCount;
    this.troopsDeployed.push(troopsCount);

    this.actions.push(
      this.updateAction(
        playerId,
        { troopsDeployed: troopsCount },
        "troopsDeployed",
        null
      )
    );

    if (this.isDeploymentOver()) {
      this.actions.push(
        this.updateAction(
          playerId,
          { troopsDeployed: troopsCount },
          "stopInitialDeployment",
          null
        )
      );

      this.actions.push(this.updateAction("", {}, "startGame", null));
    }
  }

  public init() {
    if (Object.keys(this.players).length !== 3) return; //no need of condition here.

    const continents = getContinents();
    const territories = divideTerritories(
      continents,
      Object.keys(this.players)
    );

    this.territoryState = territories;

    this.actions.push(
      this.updateAction("", { troopsCount: 21 }, "intialDeploymentStart", null)
    );
  }
}
