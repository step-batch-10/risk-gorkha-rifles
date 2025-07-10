import { BEAN } from "../constant/Bean.ts";
import { ContextBean } from "../server.ts";
import { ValidationError } from "./authService.ts";
import GameService from "./gameService.ts";

export enum LobbyType {
  THREE_PLAYER = "three_player",
  FOUR_PLAYER = "four_player",
  SIX_PLAYER = "six_player",
}

const LOBBY_CONFIG: Record<LobbyType, number> = {
  [LobbyType.THREE_PLAYER]: 3,
  [LobbyType.FOUR_PLAYER]: 4,
  [LobbyType.SIX_PLAYER]: 6,
};

export default class LobbyService implements ContextBean {
  private readonly _baseName: BEAN = BEAN.lobbyService;
  private readonly lobbies: Map<LobbyType, string[]> = new Map();

  constructor(private readonly gameService: GameService) { }

  private ensureLobbyExists(type: LobbyType): void {
    if (!this.lobbies.has(type)) {
      this.lobbies.set(type, []);
    }
  }

  private getLobbyType(noOfPlayers: number): LobbyType {
    switch (noOfPlayers) {
      case 3:
        return LobbyType.THREE_PLAYER;
      case 4:
        return LobbyType.FOUR_PLAYER;
      case 6:
        return LobbyType.SIX_PLAYER;
      default:
        throw new ValidationError(`Invalid number of players: ${noOfPlayers}`);
    }
  }

  private verifyLobbyCapacity(type: LobbyType): void {
    const lobby = this.lobbies.get(type);

    if (lobby && lobby.length === this.getRequiredPlayers(type)) {
      this.gameService.startGame(lobby);
      this.lobbies.delete(type);
    }
  }

  public joinLobby(noOfPlayers: number, playerId: string): void {
    const type = this.getLobbyType(noOfPlayers);
    this.ensureLobbyExists(type);
    const lobby = this.lobbies.get(type);

    if (lobby && !lobby.includes(playerId)) {
      lobby.push(playerId);
      this.verifyLobbyCapacity(type);
    }
  }

  public leaveLobby(playerId: string): void {
    const lobbyType = this.findPlayerLobby(playerId);
    if (!lobbyType) return;

    const lobby = this.lobbies.get(lobbyType);
    if (lobby) {
      const playerIndex = lobby.indexOf(playerId);
      if (playerIndex !== -1) {
        lobby.splice(playerIndex, 1);
      }
    }
  }

  private findPlayerLobby(playerId: string): LobbyType | null {
    for (const [type, players] of this.lobbies.entries()) {
      if (players.includes(playerId)) {
        return type;
      }
    }
    return null;
  }

  public getLobbyPlayers(playerId: string): string[] | undefined {
    const playerLobby = this.findPlayerLobby(playerId);
    if (!playerLobby) return undefined;

    return this.lobbies.get(playerLobby);
  }

  private getRequiredPlayers(type: LobbyType): number {
    return LOBBY_CONFIG[type];
  }

  get name(): BEAN {
    return this._baseName;
  }
}