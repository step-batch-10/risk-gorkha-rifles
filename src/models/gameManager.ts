import { GameStatus } from "../types/game.ts";
import Game from "./game.ts";

export default class GameManager {
  public games: Game[] = [];

  public createGame(noOfPlayers: number = 6, createdBy: string = "") {
    const game = new Game(noOfPlayers, createdBy);
    this.games.push(game);

    return game;
  }

  private isWaitingGame = (game: Game, noOfPlayers: number) => {
    return game.noOfPlayers === noOfPlayers && game.status === "waiting";
  };

  public playerActiveGame(playerId: string) {
    return this.games.find(game =>
      (game.state.players).has(playerId)
      && (game.status === GameStatus.running || game.status === GameStatus.waiting));
  }

  public allotPlayer(
    noOfPlayers: number = 6,
    playerId: string,
    playerName: string
  ) {
    const waitingGame = this.games.find((game) =>
      this.isWaitingGame(game, noOfPlayers)
    );

    const game = waitingGame || this.createGame(noOfPlayers);
    game.addPlayer(playerId, playerName);

    return game;
  }
}