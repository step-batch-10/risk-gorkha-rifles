import { assertEquals } from "assert";
import { beforeEach, describe, it } from "testing";
import Server from "../../src/server.ts";
import Users from "../../src/models/users.ts";
import Session from "../../src/models/session.ts";
import { gameManagerInstanceBuilder } from "../models/gameManager_test.ts";
import { AllotStatus } from "../../src/types/game.ts";

let uniqueId = () => {
  let i = 1;
  return () => (i++).toString();
};

export const createServerWithLoggedInUser = (
  username: string,
  uniqueIdGenerator = uniqueId
) => {
  const session = new Session(uniqueIdGenerator());
  const users = new Users(uniqueIdGenerator());
  const gameManager = gameManagerInstanceBuilder();
  const sessionId = "1";

  session.createSession(sessionId);
  users.createUser(username, "url");

  const server = new Server(users, session, gameManager, uniqueIdGenerator());
  server.serve();

  return {
    app: server.getApp,
    sessionId,
    gameManager,
    users,
    session,
  };
};

describe("getGameActions", () => {
  beforeEach(() => {
    uniqueId = () => {
      let i = 1;
      return () => (i++).toString();
    };
  });
  it("should return all teh actions that happened after the timeStamp", async () => {
    const { app, sessionId, gameManager } =
      createServerWithLoggedInUser("Jack");

    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const response = await app.request("/game/actions?since=0", {
      method: "GET",
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
    });

    assertEquals(response.status, 200);
  });
});

describe("tests for joinGame Handler", () => {
  beforeEach(() => {
    uniqueId = () => {
      let i = 1;
      return () => (i++).toString();
    };
  });
  it("should not allot the game for unauthorized user", async () => {
    const { app } = createServerWithLoggedInUser("Rose");
    const response = await app.request("/game/join-game", {
      method: "POST",
    });

    assertEquals(response.status, 302);
  });

  it("should allot the game to the user", async () => {
    const { app, sessionId } = createServerWithLoggedInUser("Jack");

    const response = await app.request("/game/join-game", {
      method: "POST",
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
    });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get("location"), "/game/waiting.html");
  });
});

describe("lobbyHandler test", () => {
  beforeEach(() => {
    uniqueId = () => {
      let i = 1;
      return () => (i++).toString();
    };
  });
  it("should return waiting status and player when player is in waiting lobby", async () => {
    const { app, gameManager } = createServerWithLoggedInUser("gour");
    gameManager.allotPlayer("1", "3");

    const response = await app.request("/game/lobby-status", {
      method: "GET",
      headers: {
        Cookie: `sessionId=1`,
      },
    });
    const expected = {
      status: AllotStatus.waitingLobby,
      players: [{ username: "gour", avatar: "url" }],
    };

    assertEquals(await response.json(), expected);
  });

  it("should return running status and player when player is not in waiting lobby", async () => {
    const { app, gameManager, users } = createServerWithLoggedInUser("gour");
    gameManager.allotPlayer("1", "3");
    users.createUser("pirate", "url2");
    users.createUser("cowboy", "url3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const response = await app.request("/game/lobby-status", {
      method: "GET",
      headers: {
        Cookie: `sessionId=1`,
      },
    });
    const expected = {
      status: AllotStatus.gameRoom,
      players: [],
    };

    assertEquals(await response.json(), expected);
  });

  it("should return waiting status and player when player is  in waiting lobby", async () => {
    const { app, gameManager, users, session } =
      createServerWithLoggedInUser("gour");
    gameManager.allotPlayer("1", "3");
    users.createUser("pirate", "url2");
    users.createUser("cowboy", "url3");
    users.createUser("dinesh", "url4");
    session.createSession("4");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");
    gameManager.allotPlayer("4", "3");

    const response = await app.request("/game/lobby-status", {
      method: "GET",
      headers: {
        Cookie: `sessionId=2`,
      },
    });
    const expected = {
      status: AllotStatus.waitingLobby,
      players: [{ username: "dinesh", avatar: "url4" }],
    };

    assertEquals(await response.json(), expected);
  });
});

describe("fullProfileDetailsHandler", () => {
  it("should return full profile details", async () => {
    const { app } = createServerWithLoggedInUser("Jack");

    const response = await app.request("/game/player-full-profile", {
      method: "GET",
      headers: {
        Cookie: `sessionId=1`,
      },
    });

    const actual = await response.json();

    const expected = {
      username: "Jack",
      avatar: "url",
      matchesPlayed: 0,
      matchesWon: 0,
    };

    assertEquals(actual, expected);
  });
});

describe("profileDetailsHandler", () => {
  it("should return full profile details", async () => {
    const { app } = createServerWithLoggedInUser("Jack");

    const response = await app.request("/game/profile-details", {
      method: "GET",
      headers: {
        Cookie: `sessionId=1`,
      },
    });

    const actual = await response.json();

    const expected = {
      username: "Jack",
      avatar: "url",
    };

    assertEquals(actual, expected);
  });
});
