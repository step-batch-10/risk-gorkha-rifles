import { assertEquals } from "assert";
import { describe, it } from "testing";
import { Hono } from "hono";

import Server from "../../src/server.ts";
import { SessionRepository } from "../../src/repository/sessionRepository.ts";
import LobbyService from "../../src/service/lobbyService.ts";
import GameService from "../../src/service/gameService.ts";

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
        "session-id": "1"
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
        "session-id": "1"
      },
      body: JSON.stringify({ noOfPlayers: 3 })
    });

    assertEquals(response.status, 200);
  });

  it("should return 400 if noOfPlayers is not provided", async () => {
    const server = createServer();

    const response = await server.request("/api/lobby/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "session-id": "1"
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
        "session-id": "1"
      },
      body: "{ noOfPlayers: 6 "
    });

    assertEquals(response.status, 500);
  });
});