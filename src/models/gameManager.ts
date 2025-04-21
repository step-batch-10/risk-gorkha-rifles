import { GameStatus } from "../types/game.ts";
import Game from "./game.ts";
import { Action } from "./risk.ts";

export default class GameManager {
  public games: Map<string, Game> = new Map();
  private currentGame: Game | null = null;
  private uniqueId: () => string;

  constructor(uniqueId: () => string = () => "1") {
    this.uniqueId = uniqueId;
  }

  public createGame(noOfPlayers: number = 3, createdBy: string = "") {
    const game = new Game(noOfPlayers, createdBy, this.uniqueId);
    this.games.set(game.gameId, game);

    return game;
  }

  public hasPlayer(playerId: string, players: { playerId: string }[]) {
    for (const player of players) {
      if (player.playerId === playerId) {
        return true;
      }
    }

    return false;
  }

  public reinforcementDetails(game: Game, userId: string) {
    return game.state.reinforceRequest(userId)
  }

  public playerActiveGame(playerId: string) {
    if (
      this.currentGame?.state.players &&
      this.hasPlayer(playerId, this.currentGame.state.players)
    )
      return this.currentGame;

    for (const [_key, value] of this.games) {
      const isActiveGame = value.status === GameStatus.running;
      const hasPlayer = this.hasPlayer(playerId, value.state.players);

      if (isActiveGame && hasPlayer) return value;
    }

    return null;
  }

  private findGame(): Game {
    if (this.currentGame?.status === "waiting") {
      return this.currentGame;
    }

    const game = this.createGame();
    this.currentGame = game;

    return game;
  }

  private getRecentActions(actions: Action[], lastActionat: number) {
    return actions.filter((action) => action.timeStamp > lastActionat);
  }

  public getGameActions(playerId: string, lastActionat: number) {
    const activeGame = this.playerActiveGame(playerId);
    const allActions = activeGame?.state.actions;
    const gameActionsBuffer = this.getRecentActions(
      allActions ?? [],
      lastActionat
    );

    return {
      status: activeGame?.status,
      currentPlayer: playerId,
      actions: gameActionsBuffer,
      players: activeGame?.state.players,
    };
  }

  public allotPlayer(
    _noOfPlayers: number = 3,
    playerId: string,
    playerName: string | undefined = ""
  ) {
    const activeGame: Game | null = this.playerActiveGame(playerId);
    if (activeGame) return activeGame;

    const game = this.findGame();
    game.addPlayer(playerId, playerName);

    return game;
  }

 
  public updateTroops(
    game: Game,
    userId: string,
    territory: string,
    troops: number
  ) {
    game.state.deployTroops(userId, territory, troops);
  }
}
