import Risk from "./risk.ts";
import { GameStatus } from "../types/game.ts";

export default class Game {
  readonly gameId: string;
  public noOfPlayers: number;
  public createdBy: string;
  public createdAt: number;
  public status: GameStatus;
  public state: Risk;
  private clearWaiting: (game: Game) => void;

  constructor(
    noOfPlayers: number = 6,
    createdBy: string = "",
    clearWaiting: (game: Game) => void = () => {},
    generateId = () => "1",
    createdAt = () => 1
  ) {
    this.gameId = generateId();
    this.noOfPlayers = noOfPlayers;
    this.createdBy = createdBy;
    this.createdAt = createdAt();
    this.status = GameStatus.waiting;
    this.state = new Risk();
    this.clearWaiting = clearWaiting;
  }

  public addPlayer(playerId: string, playerName: string) {
    this.state.addPlayer(playerId, playerName);
    if (Object.keys(this.state.players).length === this.noOfPlayers) {
      this.startGame();
      return;
    }
  }

  private startGame() {
    this.status = GameStatus.running;
    this.state.init();
    this.clearWaiting(this);
  }
}
