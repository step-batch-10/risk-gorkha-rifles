import { assertEquals } from "assert";
import { describe, it } from "testing";
import { Hono } from "hono";

import Server from "../../src/server.ts";
import { SessionRepository } from "../../src/repository/sessionRepository.ts";
import LobbyService from "../../src/service/lobbyService.ts";
import GameService from "../../src/service/gameService.ts";
import AccountService from "../../src/service/accountService.ts";
import { UserRepository } from "../../src/repository/userRepository.ts";

const createServer = () => {
  const app = new Hono();

  const mockedSessionService = new SessionRepository(() => "1");
  mockedSessionService.createSession("1");
  const lobbyService = new LobbyService(new GameService());
  const server = new Server(app, [mockedSessionService, lobbyService]);

  server.initialize();

  return app;
};

describe("Lobby Handler", () => {
  it("should return 400 if lobby type is invalid", async () => {
    const server = createServer();

    const response = await server.request("/api/lobby/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": "sessionId=1"
      },
      body: JSON.stringify({ noOfPlayers: 5 })
    });

    assertEquals(response.status, 400);
  });

  it("should return 200 when a player joins a valid lobby", async () => {
    const server = createServer();

    const response = await server.request("/api/lobby/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": "sessionId=1"
      },
      body: JSON.stringify({ noOfPlayers: 3 })
    });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get("location"), "waiting.html");
  });

  it("should return 400 if noOfPlayers is not provided", async () => {
    const server = createServer();

    const response = await server.request("/api/lobby/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": "sessionId=1"
      },
      body: JSON.stringify({})
    });

    assertEquals(response.status, 400);
  });

  it("should return 500 if an unexpected error occurs", async () => {
    const server = createServer();

    const response = await server.request("/api/lobby/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": "sessionId=1"
      },
      body: "{ noOfPlayers: 6 "
    });

    assertEquals(response.status, 500);
  });

  it("should return the players in the lobby", async () => {
    const createMockServerWithPlayers = () => {
      const app = new Hono();

      const sessionService = new SessionRepository(() => "1");
      sessionService.createSession("1");
      sessionService.createSession("2");
      sessionService.createSession("3");

      const lobbyService = new LobbyService(new GameService());
      lobbyService.joinLobby(4, "1");
      lobbyService.joinLobby(4, "2");
      lobbyService.joinLobby(4, "3");

      const userRepository = new UserRepository(inc());
      userRepository.createUser("user 1", "avatar 1");
      userRepository.createUser("user 2", "avatar 2");
      userRepository.createUser("user 3", "avatar 3");

      const accountService = new AccountService(userRepository);

      const server = new Server(app, [sessionService, lobbyService, accountService]);
      server.initialize();

      return app;
    };

    const mockedServer = createMockServerWithPlayers();
    const response = await mockedServer.request("/api/lobby/status", {
      method: "GET",
      headers: {
        Cookie: "sessionId=1"
      }
    });

    const playerProfiles = await response.json();

    const expected = [
      { username: "user 1", avatar: "avatar 1" },
      { username: "user 2", avatar: "avatar 2" },
      { username: "user 3", avatar: "avatar 3" },
    ];

    assertEquals(200, response.status);
    assertEquals(true, playerProfiles.status);
    assertEquals(expected, playerProfiles.players);
  });

  it("should return 400 if the player is not in lobby", async () => {
    const createMockServerWithPlayers = () => {
      const app = new Hono();

      const sessionService = new SessionRepository(() => "1");
      sessionService.createSession("1");
      sessionService.createSession("2");
      sessionService.createSession("3");

      const lobbyService = new LobbyService(new GameService());
      lobbyService.joinLobby(3, "1");
      lobbyService.joinLobby(3, "2");
      lobbyService.joinLobby(3, "3");

      const userRepository = new UserRepository(inc());
      userRepository.createUser("user 1", "avatar 1");
      userRepository.createUser("user 2", "avatar 2");
      userRepository.createUser("user 3", "avatar 3");

      const accountService = new AccountService(userRepository);

      const server = new Server(app, [sessionService, lobbyService, accountService]);
      server.initialize();

      return app;
    };

    const mockedServer = createMockServerWithPlayers();
    const response = await mockedServer.request("/api/lobby/status", {
      method: "GET",
      headers: {
        Cookie: "sessionId=1"
      }
    });

    const responseJSON = await response.json();
    assertEquals(false, responseJSON.status);
    assertEquals(response.status, 200);
  });
});

const inc = () => {
  let i = 1;

  return () => (i++).toString();
};
