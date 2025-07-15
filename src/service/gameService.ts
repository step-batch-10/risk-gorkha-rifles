import { IdGenerator } from "../main.ts";
import { RiskGame } from "../core/risk.ts";

export interface GameServiceConfig {
  createGame: (players: string[]) => RiskGame;
  idGenerator: IdGenerator;
}

export default class GameService {
  private readonly gameDependencies: GameServiceConfig;
  private readonly runningGames: Map<string, RiskGame>;

  constructor(gameDependencies: GameServiceConfig) {
    this.gameDependencies = gameDependencies;
    this.runningGames = new Map();
  }

  public getGameById(id: string): RiskGame | undefined {
    return this.runningGames.get(id);
  }

  public startGame(playersIds: string[]): void {
    const riskGame = this.gameDependencies.createGame(playersIds);
    riskGame.initialize();

    const gameId = this.gameDependencies.idGenerator();
    this.runningGames.set(gameId, riskGame);
  }
}