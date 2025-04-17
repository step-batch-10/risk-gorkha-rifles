import { assertEquals } from "assert";
import { describe, it } from "testing";
import Server from "../../src/server.ts";
import Users from "../../src/models/users.ts";
import Session from "../../src/models/session.ts";
import GameManager from "../../src/models/gameManager.ts";

const uniqueId = () => "1";

describe("boardDataHandler", () => {
  it("should return game instance and status 200", async () => {
    const session = new Session(uniqueId);
    const users = new Users(uniqueId);
    const gameManager = new GameManager(uniqueId);
    users.createUser("hello");
    session.createSession("1");
    gameManager.allotPlayer(6, "1", "jayanth");

    const server = new Server(users, session, gameManager, uniqueId);

    const response = await server.app.request("/game/game-board", {
      method: "GET",
      headers: {
        Cookie: "sessionId=1",
      },
    });
    assertEquals(response.status, 200);
  });
});

describe('tests for joinGame Handler', () => {
  it('should not allot the game for unauthorized user', async () => {
    const users = new Users();
    const sessions = new Session();
    const gameManager = new GameManager();

    const server = new Server(users, sessions, gameManager, () => "1");
    const response = await server.app.request("/game/join-game", { method: "POST" });

    assertEquals(response.status, 401);
  });

  it('should allot the game to the user', async () => {
    const users = new Users();
    users.createUser("shikha");
    const sessions = new Session();
    sessions.createSession("1");
    const gameManager = new GameManager();

    const server = new Server(users, sessions, gameManager, () => "1");
    const response = await server.app.request("/game/join-game",
      {
        method: "POST",
        headers: {
          Cookie: "sessionId=1",
        },
      });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get('location'), '/game');
  });
});