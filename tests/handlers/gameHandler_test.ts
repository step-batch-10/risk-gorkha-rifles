import { assertEquals, assert } from "assert";
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
    gameManager.allotPlayer(3, "1", "jayanth");

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

describe("tests for joinGame Handler", () => {
  it("should not allot the game for unauthorized user", async () => {
    const users = new Users();
    const sessions = new Session();
    const gameManager = new GameManager();

    const server = new Server(users, sessions, gameManager, () => "1");
    const response = await server.app.request("/game/join-game", {
      method: "POST",
    });

    assertEquals(response.status, 302);
  });

  it("should allot the game to the user", async () => {
    const users = new Users();
    users.createUser("shikha");
    const sessions = new Session();
    sessions.createSession("1");
    const gameManager = new GameManager();

    const server = new Server(users, sessions, gameManager, () => "1");
    const response = await server.app.request("/game/join-game", {
      method: "POST",
      headers: {
        Cookie: "sessionId=1",
      },
    });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get("location"), "/game");
  });

  it("should update the troops for an authorized user", async () => {
    const users = new Users();
    users.createUser("shikha");
    const sessions = new Session();
    sessions.createSession("1");
    const gameManager = new GameManager();
    gameManager.allotPlayer(3, "1", "A");
    gameManager.allotPlayer(3, "2", "B");
    gameManager.allotPlayer(3, "3", "C");

    const server = new Server(users, sessions, gameManager, () => "1");
    const response = await server.app.request("/game/update-troops", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "sessionId=1",
      },
      body: JSON.stringify({
        troops: 10,
        territory: "india",
      }),
    });
    const responseBody = await response.json();
    assertEquals(responseBody.message, "successfully updated troops");
  });

  it("should update the troops for an unauthorized user", async () => {
    const users = new Users();
    users.createUser("shikha");
    const sessions = new Session();
    sessions.createSession("1");
    const gameManager = new GameManager();

    const server = new Server(users, sessions, gameManager, () => "1");
    const response = await server.app.request("/game/update-troops", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "sessionId=1",
      },
      body: JSON.stringify({
        troops: 10,
        territory: "india",
      }),
    });
    const responseBody = await response.json();

    assertEquals(responseBody.message, "Game not found");
    assertEquals(response.status, 400);
  });
});

const createServerWithLoggedInUser = (username: string) => {
  const session = new Session(uniqueId);
  const users = new Users(uniqueId);
  const gameManager = new GameManager(uniqueId);
  const sessionId = "1";

  session.createSession(sessionId);
  users.createUser(username);

  const server = new Server(users, session, gameManager, uniqueId);
  return { server, sessionId };
};

describe("fetchPlayerInfo", () => {
  it("should return profile details of the logged in user", async () => {
    const { server, sessionId } = createServerWithLoggedInUser("Jack");
    const response = await server.app.request("/game/profile-details", {
      method: "GET",
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
    });

    assertEquals(response.status, 200);
    const responseBody = await response.json();

    assertEquals(responseBody.playerName, "Jack");
    assert("avatar" in responseBody);
  });
});

describe("fetchFullPlayerInfo", () => {
  it("should return full profile details of the logged in user", async () => {
    const { server, sessionId } = createServerWithLoggedInUser("Jack");
    const response = await server.app.request("/game/player-full-profile", {
      method: "GET",
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
    });

    assertEquals(response.status, 200);
    const responseBody = await response.json();

    assertEquals(responseBody.playerName, "Jack");
    assertEquals(responseBody.matchesPlayed, 0);
    assertEquals(responseBody.matchesWon, 0);
    assert("avatar" in responseBody);
  });
});
