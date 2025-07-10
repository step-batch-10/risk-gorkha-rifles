import { assertEquals } from "assert";
import { describe, it } from "testing";
import LobbyService, { LobbyType } from "../../src/service/lobbyService.ts";

class MockGameService {
  public startedGames: string[][] = [];

  startGame(players: string[]): void {
    this.startedGames.push([...players]);
  }
}

describe("LobbyService", () => {
  it("should add a player to an empty lobby", () => {
    const gameService = new MockGameService();
    const lobbyService = new LobbyService(gameService);

    lobbyService.joinLobby(3, "player1");

    assertEquals(gameService.startedGames.length, 0);
  });

  it("should add multiple players to the same lobby", () => {
    const gameService = new MockGameService();
    const lobbyService = new LobbyService(gameService);

    lobbyService.joinLobby(6, "player1");
    lobbyService.joinLobby(6, "player2");

    const players = (lobbyService as any).lobbies.get(LobbyType.SIX_PLAYER);
    assertEquals(players, ["player1", "player2"]);
  });

  it("should throw an error for invalid lobby type", () => {
    const gameService = new MockGameService();
    const lobbyService = new LobbyService(gameService);

    try {
      lobbyService.joinLobby(5, "player1");
    } catch (err: any) {
      assertEquals(err instanceof Error, true);
      assertEquals(err.message, "Invalid number of players: 5");
    }
  });

  it("should not add a player twice to the same lobby", () => {
    const gameService = new MockGameService();
    const lobbyService = new LobbyService(gameService);

    lobbyService.joinLobby(3, "player1");
    lobbyService.joinLobby(3, "player1");

    const players = (lobbyService as any).lobbies.get(LobbyType.THREE_PLAYER);
    assertEquals(players, ["player1"]);
  });

  it("should start the game when enough players join", () => {
    const gameService = new MockGameService();
    const lobbyService = new LobbyService(gameService);

    lobbyService.joinLobby(3, "p1");
    lobbyService.joinLobby(3, "p2");
    lobbyService.joinLobby(3, "p3");

    assertEquals(gameService.startedGames.length, 1);
    assertEquals(gameService.startedGames[0].sort(), ["p1", "p2", "p3"].sort());
  });

  it("should remove a player from the lobby", () => {
    const gameService = new MockGameService();
    const lobbyService = new LobbyService(gameService);

    lobbyService.joinLobby(4, "p1");
    lobbyService.leaveLobby("p1");

    const players = (lobbyService as any).lobbies.get(LobbyType.FOUR_PLAYER);
    assertEquals(players, []);
  });

  it("should not throw when leaving a lobby if player not found", () => {
    const gameService = new MockGameService();
    const lobbyService = new LobbyService(gameService);

    lobbyService.leaveLobby("ghost");
    assertEquals(true, true);
  });

  it("should throw error on undefined lobby type in config", () => {
    const gameService = new MockGameService();
    const lobbyService = new LobbyService(gameService);

    const badType = "non_existing_type" as LobbyType;

    try {
      lobbyService["getRequiredPlayers"](badType);
    } catch (err) {
      assertEquals(err instanceof Error, true);
    }
  });

  it("should return lobby waiting players", () => {
    const gameService = new MockGameService();
    const lobbyService = new LobbyService(gameService);
    lobbyService.joinLobby(3, "1");
    lobbyService.joinLobby(3, "2");

    const lobbyPlayers = lobbyService.getLobbyPlayers("1");

    assertEquals(["1", "2"], lobbyPlayers);
  });


  it("should return null if player is not in the lobby", () => {
    const gameService = new MockGameService();
    const lobbyService = new LobbyService(gameService);
    lobbyService.joinLobby(3, "1");
    lobbyService.joinLobby(3, "2");

    const lobbyPlayers = lobbyService.getLobbyPlayers("3");

    assertEquals(undefined, lobbyPlayers);
  });
});
