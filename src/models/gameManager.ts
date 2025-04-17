import { GameStatus } from "../types/game.ts";
import Game from "./game.ts";

export default class GameManager {
  public games: Map<string, Game> = new Map();
  private waitingGame: Game | null = null;

  public createGame(noOfPlayers: number = 6, createdBy: string = "") {
    const game = new Game(noOfPlayers, createdBy, this.clearWaiting.bind(this));

    return game;
  }

  public clearWaiting(game: Game) {
    this.games.set(game.gameId, game);
    this.waitingGame = null;
  }

  public playerActiveGame(playerId: string) {
    if (this.waitingGame?.state.players.has(playerId)) return this.waitingGame;

    for (const [_key, value] of this.games) {
      const hasPlayer = value.state.players.has(playerId);
      const isActiveGame = value.status === GameStatus.running;

      if (isActiveGame && hasPlayer) return value;
    }

    return null;
  }

  private findGame(): Game {
    if (this.waitingGame) return this.waitingGame;
    const game = this.createGame();
    this.waitingGame = game;

    return game;
  }

  public allotPlayer(
    _noOfPlayers: number = 6,
    playerId: string,
    playerName: string
  ) {
    const game = this.findGame();
    game.addPlayer(playerId, playerName);

    return game;
  }
}