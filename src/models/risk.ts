import { Territory } from "../types/game.ts";
import { divideTerritories, getContinents } from "../utils/territory.ts";

interface PlayerDetails {
  name: string;
  colour: string;
  avatar: string;
}

interface PlayerProfile {
  colour: string;
  avatar: string;
}

const playerProfileData: PlayerProfile[] = [
  { colour: "red", avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740" },
  { colour: "yellow", avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740" },
  { colour: "blue", avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740" },
  { colour: "violet", avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740" },
  { colour: "orange", avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740" },
  { colour: "pink", avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740" },
];

export default class Risk {
  public players: { [key: string]: PlayerDetails };
  public territoryState: Map<string, Territory>;
  private playerProfile;
  public action = {
    name: "",
  };

  constructor(playerProfile = playerProfileData) {
    this.players = {};
    this.territoryState = new Map();
    this.playerProfile = playerProfile;
  }

  public addPlayer(playerId: string, playerName: string) {
    const index = Object.keys(this.players).length;
    const profile = this.playerProfile.at(index);

    const { colour, avatar } = profile || { colour: "gold", avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740" };

    this.players[playerId] = { name: playerName, colour, avatar };
  }

  public deployTroops(territory: string, troopsCount: number) {
    const territoryData = this.territoryState.get(territory);

    if (territoryData) {
      territoryData.troops += troopsCount;
    }
  }

  public init() {
    if (Object.keys(this.players).length !== 6) return; //no need of condition here.

    const continents = getContinents();
    const territories = divideTerritories(
      continents,
      Object.keys(this.players)
    );

    this.action.name = "initialDeployment";
    this.territoryState = territories;
  }
}
