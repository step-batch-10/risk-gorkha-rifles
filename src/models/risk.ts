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
  { colour: "red", avatar: "url" },
  { colour: "yellow", avatar: "url" },
  { colour: "blue", avatar: "url" },
  { colour: "violet", avatar: "url" },
  { colour: "orange", avatar: "url" },
  { colour: "pink", avatar: "url" },
];

export default class Risk {
  public players: { [key: string]: PlayerDetails; };
  public territoryState: Map<string, Territory>;
  private playerProfile;
  public action = {
    name: ""
  };

  constructor(playerProfile = playerProfileData) {
    this.players = {};
    this.territoryState = new Map();
    this.playerProfile = playerProfile;
  }

  public addPlayer(playerId: string, playerName: string) {
    const index = Object.keys(this.players).length;
    const profile = this.playerProfile.at(index);

    const { colour, avatar } = profile || { colour: "gold", avatar: "url" };

    this.players[playerId] = { name: playerName, colour, avatar };
  }

  public updateTroops(territory: string, troopsCount: number) {
    const territoryData = this.territoryState.get(territory);

    if (territoryData) {
      territoryData.troops = troopsCount;
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
