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

  public allotPlayer(
    noOfPlayers: number = 6,
    playerId: string,
    playerName: string
  ) {
    const waitingGame = this.games.find((game) =>
      this.isWaitingGame(game, noOfPlayers)
    );

    const game = waitingGame || this.createGame(noOfPlayers);
    game.addPlayer(playerName, playerId);

    return game;
  }
}