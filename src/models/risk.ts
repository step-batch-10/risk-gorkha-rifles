import { Territory } from "../types/game.ts";
import { divideTerritories, getContinents } from "../utils/territory.ts";

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
  private uniqueId: () => string;
  public players: PlayerDetails[];
  public territoryState: Map<string, Territory>;
  private playerProfile;
  public actions: Action[] = [];

  constructor(generateId: () => string, playerProfile = playerProfileData) {
    this.players = [];
    this.territoryState = new Map();
    this.playerProfile = playerProfile;
    this.uniqueId = generateId;
  }

  public addPlayer(playerId: string, playerName: string) {
    const index = Object.keys(this.players).length;
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

  public deployTroops(
    playerId: string,
    territory: string,
    troopsCount: number
  ) {
    const territoryData = this.territoryState.get(territory);

    if (territoryData) {
      territoryData.troops += troopsCount;

      this.actions.push({
        id: this.uniqueId(),
        name: "troopsDeployed",
        playerId: null,
        currentPlayer: playerId,
        data: {
          troopsDeployed: troopsCount,
        },
        timeStamp: Date.now(),
        territoryState: this.territoryState,
      });
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

    this.actions.push({
      id: this.uniqueId(),
      name: "intialDeploymentStart",
      playerId: null,
      currentPlayer: "2",
      data: {
        troopsCount: 21,
      },
      timeStamp: Date.now(),
      territoryState: this.territoryState,
    });
  }
}
