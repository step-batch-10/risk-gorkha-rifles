import { GameStatus } from '../types/game.ts';
import Game from './game.ts';

export default class GameManager {
  public games: Map<string, Game> = new Map();
  private currentGame: Game | null = null;
  private uniqueId: () => string;

  constructor(uniqueId: () => string = () => '1') {
    this.uniqueId = uniqueId;
  }

  public createGame(noOfPlayers: number = 3, createdBy: string = '') {
    const game = new Game(
      noOfPlayers,
      createdBy,
      this.uniqueId
    );

    return game;
  }

  public playerActiveGame(playerId: string) {
    if (
      this.currentGame?.state.players &&
      playerId in this.currentGame.state.players
    )
      return this.currentGame;

    for (const [_key, value] of this.games) {
      const hasPlayer = playerId in value.state.players;
      const isActiveGame = value.status === GameStatus.running;

      if (isActiveGame && hasPlayer) return value;
    }

    return null;
  }

  private findGame(): Game {
    if (this.currentGame?.status === "waiting") {
      this.games.set(this.currentGame.gameId, this.currentGame);
      return this.currentGame;
    };

    const game = this.createGame();
    this.currentGame = game;

    return game;
  }

  public getPlayerGameDetails(playerId: string) {
    const activeGame = this.playerActiveGame(playerId);

    const gameDetails = {
      status: activeGame?.status,
      currentPlayer: playerId,
      state: {
        territories: Object.fromEntries(
          activeGame?.state.territoryState ?? new Map()
        ),
        players: activeGame?.state.players,
        action: activeGame?.state.action,
      },
    };

    return gameDetails;
  }

  public allotPlayer(
    _noOfPlayers: number = 3,
    playerId: string,
    playerName: string | undefined = ''
  ) {
    const activeGame: Game  | null = this.playerActiveGame(playerId);
    if (activeGame) return activeGame;

    const game = this.findGame();
    game.addPlayer(playerId, playerName);

    return game;
  }

  public updateTroops(game: Game, territory: string, troops: number) {
    game.state.deployTroops(territory, troops);
  }
}
