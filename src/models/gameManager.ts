import Game from "./game.ts";
import { Continent, GameStatus } from "../types/game.ts";
import lodash from "npm:lodash";
import { Action } from "./game.ts";

export default class GameManager {
  private gameSessions: Record<string, string> = {};
  private games: Game[] = [];
  private waitingLobbies: Record<string, Set<string>> = { "3": new Set() };
  private uniqueId: () => string;
  private getContinents: () => Continent;
  private timeStamp: () => number = Date.now;

  constructor(
    uniqueId: () => string,
    getContinents: () => Continent,
    timeStamp: () => number
  ) {
    this.uniqueId = uniqueId;
    this.getContinents = getContinents;
    this.timeStamp = timeStamp;
  }

  private createGame(players: Set<string>) {
    const gameId = this.uniqueId();
    const continents = this.getContinents();
    const game = new Game(
      players,
      continents,
      this.uniqueId,
      lodash.shuffle,
      this.timeStamp
    );
    this.games.push(game);
    players.forEach((playerId) => (this.gameSessions[playerId] = gameId));

    return gameId;
  }

  public allotPlayer(playerId: string, noOfPlayers: string) {
    const currentLobby = this.waitingLobbies[noOfPlayers];
    currentLobby.add(playerId);

    if (currentLobby.size === parseInt(noOfPlayers)) {
      this.createGame(currentLobby);
      this.waitingLobbies[noOfPlayers] = new Set();
    }

    return this.waitingLobbies[noOfPlayers];
  }

  private getRecentActions(actions: Action[] = [], timeStamp: number) {
    const index = actions.findIndex((action) => {
      action.timeStamp > timeStamp;
    });

    return actions.slice(index);
  }

  public getGameActions(playerId: string, lastActionat: number) {
    const activeGame = this.findPlayerActiveGame(playerId);
    const allActions = activeGame?.gameActions;
    const recentActions = this.getRecentActions(allActions, lastActionat);

    return {
      status: activeGame?.status,
      currentPlayer: playerId,
      actions: recentActions,
      players: activeGame?.allPlayers,
    };
  }

  public findPlayerActiveGame(playerId: string) {
    return this.games.find(
      (game) => game.hasPlayer(playerId) && game.status === GameStatus.running
    );
  }
}
