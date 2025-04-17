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

    // console.log(gameManager);

    const server = new Server(users, session, gameManager, uniqueId);

    const response = await server.app.request("/game/game-board", {
      method: "GET",
      headers: {
        Cookie: "sessionId=1",
      },
    });

console.log("*".repeat(50));

    console.log(await response.text());

    assertEquals(response.status, 200);
  });
});
