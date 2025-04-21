import { assertEquals, assert } from "assert";
import { describe, it } from "testing";
import Server from "../../src/server.ts";
import Users from "../../src/models/users.ts";
import Session from "../../src/models/session.ts";
import GameManager from "../../src/models/gameManager.ts";

const uniqueId = () => "1";

export const createServerWithLoggedInUser = (username: string) => {
  const session = new Session(uniqueId);
  const users = new Users(uniqueId);
  const gameManager = new GameManager(uniqueId);
  const sessionId = "1";

  session.createSession(sessionId);
  users.createUser(username);

  const server = new Server(users, session, gameManager, uniqueId);
  return {
    server,
    sessionId,
    gameManager,
    users,
    session,
  };
};

describe("getGameActions", () => {
  it("should return all teh actions that happened after the timeStamp", async () => {
    const { server, sessionId, gameManager } =
      createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer(3, "1", "jayanth");
    gameManager.allotPlayer(3, "2", "jay");
    gameManager.allotPlayer(3, "3", "priyankush");

    const response = await server.app.request("/game/actions?since=0", {
      method: "GET",
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
    });

    assertEquals(response.status, 200);
  });
});

describe("tests for joinGame Handler", () => {
  it("should not allot the game for unauthorized user", async () => {
    const { server } = createServerWithLoggedInUser("Rose");
    const response = await server.app.request("/game/join-game", {
      method: "POST",
    });

    assertEquals(response.status, 302);
  });

  it("should allot the game to the user", async () => {
    const { server, sessionId } = createServerWithLoggedInUser("Jack");

    const response = await server.app.request("/game/join-game", {
      method: "POST",
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
    });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get("location"), "/game");
  });

  it("should update the troops for an authorized user", async () => {
    const { server, sessionId, gameManager } =
      createServerWithLoggedInUser("John");
    gameManager.allotPlayer(3, "1", "A");
    gameManager.allotPlayer(3, "2", "B");
    gameManager.allotPlayer(3, "3", "C");

    const response = await server.app.request("/game/update-troops", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `sessionId=${sessionId}`,
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
    const { server, sessionId } = createServerWithLoggedInUser("Jack");
    const response = await server.app.request("/game/update-troops", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `sessionId=${sessionId}`,
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
