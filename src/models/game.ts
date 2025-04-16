import Risk from './risk.ts';
import { GameStatus } from '../types/game.ts';

export default class Game {
  public gameId: string;
  public noOfPlayers: number;
  public createdBy: string;
  public createdAt: number;
  public status: GameStatus;
  public state: Risk;

  constructor(
    noOfPlayers: number = 6,
    createdBy: string = '',
    generateId = () => '1',
    createdAt = () => 1
  ) {
    this.gameId = generateId();
    this.noOfPlayers = noOfPlayers;
    this.createdBy = createdBy;
    this.createdAt = createdAt();
    this.status = GameStatus.waiting;
    this.state = new Risk();
  }

  public addPlayer(playerId: string, playerName: string) {
    const game = this.state.addPlayer(playerId, playerName);
    if (this.state.players.size === this.noOfPlayers) {
      this.startGame();
      return;
    }

    return game;
  }

  private startGame() {
    this.status = GameStatus.running;
    this.state.init();
  }
}
