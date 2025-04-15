export default class Risk {
  public players: Record<string, string>;

  constructor() {
    this.players = {};
  }

  public addPlayer(playerId: string, playerName: string) {
    this.players[playerId] = playerName;
  }
}