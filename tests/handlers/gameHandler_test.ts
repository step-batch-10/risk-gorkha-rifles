import { assertEquals } from "assert";
import { describe, it } from "testing";
import Server from "../../src/server.ts";
import Users from "../../src/models/users.ts";
import Session from "../../src/models/session.ts";
import { gameManagerInstanceBuilder } from "../models/gameManager_test.ts";
import { AllotStatus } from "../../src/types/gameTypes.ts";

const uniqueId = () => {
  let i = 1;
  return () => (i++).toString();
};

export const createServerWithLoggedInUser = (
  username: string,
  uniqueIdGenerator = uniqueId
) => {
  const session = new Session(uniqueIdGenerator());
  const users = new Users(uniqueIdGenerator());
  const gameManager = gameManagerInstanceBuilder(() => ({
    Asia: ["india", "china", "nepal"],
  }));
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
  it("should return all the actions that happened after the timeStamp", async () => {
    const { app, sessionId, gameManager, users } =
      createServerWithLoggedInUser("Jack");
    users.createUser("2", "url");
    users.createUser("3", "url");

    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const response = await app.request("/game/actions?since=0", {
      method: "GET",
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
    });

    const players = [
      {
        avatar: "url",
        username: "Jack",
        colour: "#50C878",
        id: "1",
      },
      {
        avatar: "url",
        username: "2",
        colour: "#DAA520",
        id: "2",
      },
      {
        avatar: "url",
        username: "3",
        colour: "#FF7F50",
        id: "3",
      },
    ];

    const expected = {
      actions: [
        {
          currentPlayer: "",
          data: {
            newTroops: 21,
          },
          id: "1",
          name: "startInitialDeployment",
          playerId: null,
          to: null,
          currentCavalryPos: 0,
          bonusTroops:[0,10,20,30,40,50,60],
          playerStates: {
            "1": {
              availableTroops: 21,
              cards: [],
              continents: [],
              territories: ["india"],
            },
            "2": {
              availableTroops: 21,
              cards: [],
              continents: [],
              territories: ["china"],
            },
            "3": {
              availableTroops: 21,
              cards: [],
              continents: [],
              territories: ["nepal"],
            },
          },
          territoryState: {
            china: {
              owner: "2",
              troops: 1,
            },
            india: { owner: "1", troops: 1 },
            nepal: {
              owner: "3",
              troops: 1,
            },
          },
          timeStamp: 1,
        },
      ],
      userId: "1",
      players,
      status: "running",
    };
    const actual = await response.json();

    assertEquals(response.status, 200);
    assertEquals(actual, expected);
  });
});

describe("tests for joinGame Handler", () => {
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

describe("update troop handler", () => {
  it("should return the updated territory details and player state", async () => {
    const { app, gameManager, sessionId } =
      createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const response = await app.request("/game/update-troops", {
      method: "POST",
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
      body: JSON.stringify({ territory: "india", troopCount: 10 }),
    });

    const actual = await response.json();

    const expected = {
      territory: { owner: "1", troops: 11 },
      player: {
        territories: ["india"],
        continents: [],
        availableTroops: 11,
        cards: [],
      },
    };

    assertEquals(actual, expected);
  });
});

describe("requestReinforcementHandler", () => {
  it("should return the available troops of that player", async () => {
    const { app, gameManager } = createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const response = await app.request("/game/request-reinforcement", {
      method: "GET",
      headers: {
        Cookie: `sessionId=1`,
      },
    });

    assertEquals(await response.json(), {
      newTroops: 3,
      territories: ["india"],
    });
  });
});

describe("requestAttack", () => {
  it("should return the player territories", async () => {
    const { app, gameManager } = createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const response = await app.request("/game/request-attack", {
      method: "GET",
      headers: {
        Cookie: `sessionId=1`,
      },
    });

    assertEquals(await response.json(), { attackingTerritories: [] });
    assertEquals(response.status, 200);
  });
});

describe("deploymentStatusHandler test", () => {
  it("should return true when deployment is over", async () => {
    const { app, gameManager, users, session, sessionId } =
      createServerWithLoggedInUser("1");
    users.createUser("2", "url");
    users.createUser("3", "url");

    const session2Id = session.createSession("2");
    const session3Id = session.createSession("3");

    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    await app.request("/game/update-troops", {
      method: "POST",
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
      body: JSON.stringify({
        territory: "india",
        troopCount: 21,
      }),
    });

    await app.request("/game/update-troops", {
      method: "POST",
      headers: {
        Cookie: `sessionId=${session2Id}`,
      },
      body: JSON.stringify({
        territory: "china",
        troopCount: 21,
      }),
    });

    await app.request("/game/update-troops", {
      method: "POST",
      headers: {
        Cookie: `sessionId=${session3Id}`,
      },
      body: JSON.stringify({
        territory: "nepal",
        troopCount: 21,
      }),
    });
    const response = await app.request("/game/start-game", {
      method: "GET",
      headers: {
        Cookie: `sessionId=1`,
      },
    });

    assertEquals(await response.json(), { status: true });
  });

  it("should return false when deployment is not over", async () => {
    const { app, gameManager } = createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const response = await app.request("/game/start-game", {
      method: "GET",
      headers: {
        Cookie: `sessionId=1`,
      },
    });

    assertEquals(await response.json(), { status: false });
  });
});

describe("defendingTerritories", () => {
  it("should return the neighbouring territories for the given territory", async () => {
    const { app, gameManager } = createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");
    const response = await app.request("/game/request-defendTerritories", {
      method: "POST",
      headers: {
        Cookie: `sessionId=1`,
      },
      body: JSON.stringify({ attackingTerritoryId: "alaska" }),
    });

    assertEquals(await response.json(), { defendingTerritories: [] });
    assertEquals(response.status, 200);
  });
});

describe("requestDefendingPlayer", () => {
  it("should return the owner for the given territory", async () => {
    const { app, gameManager } = createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");
    const response = await app.request("/game/request-defendingPlayer", {
      method: "POST",
      headers: {
        Cookie: `sessionId=1`,
      },
      body: JSON.stringify({ defendingTerritory: "india" }),
    });

    assertEquals(await response.json(), { defendingPlayer: "1" });
    assertEquals(response.status, 200);
  });

  it("should return player not found when given territory is not found", async () => {
    const { app, gameManager } = createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const response = await app.request("/game/request-defendingPlayer", {
      method: "POST",
      headers: {
        Cookie: `sessionId=1`,
      },
      body: JSON.stringify({ defendingTerritory: "alaska" }),
    });

    assertEquals(await response.json(), {
      defendingPlayer: "player not found",
    });

    assertEquals(response.status, 200);
  });
});

describe("cardsHandler", () => {
  it("should return the player cards", async () => {
    const { app, gameManager } = createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");
    const response = await app.request("/game/cards", {
      method: "GET",
      headers: {
        Cookie: `sessionId=1`,
      },
    });

    assertEquals(await response.json(), {
      infantry: 0,
      cavalry: 0,
      artillery: 0,
      hybrid: 0,
    });
  });
});

describe("connectedTerritoriesHandler", () => {
  it("should return the connected territories", async () => {
    const session = new Session(uniqueId());
    const users = new Users(uniqueId());
    const gameManager = gameManagerInstanceBuilder(() => ({
      Asia: ["india", "china", "nepal"],
    }));
    const sessionId = "1";

    session.createSession(sessionId);
    users.createUser("jack", "url");

    const server = new Server(users, session, gameManager, uniqueId());
    server.serve();

    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const response = await server.getApp.request(
      "/game/connected-territories?territoryId=india",
      {
        method: "GET",
        headers: {
          Cookie: `sessionId=1`,
        },
      }
    );

    assertEquals(await response.json(), ["india"]);
  });

  it("should return 400 if territoryId not given", async () => {
    const session = new Session(uniqueId());
    const users = new Users(uniqueId());
    const gameManager = gameManagerInstanceBuilder(() => ({
      Asia: ["india", "china", "nepal"],
    }));
    const sessionId = "1";

    session.createSession(sessionId);
    users.createUser("jack", "url");

    const server = new Server(users, session, gameManager, uniqueId());
    server.serve();

    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const response = await server.getApp.request(
      "/game/connected-territories?territoryId",
      {
        method: "GET",
        headers: {
          Cookie: `sessionId=1`,
        },
      }
    );

    assertEquals(response.status, 400);
    assertEquals(await response.json(), { message: "Territory Id not given" });
  });
});

describe("storeTroopsToAttack", () => {
  it("should should store the troops count ohe troops count of the attacker and should return success message", async () => {
    const { app, gameManager } = createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const game = gameManager.findPlayerActiveGame("1");
    game?.getNeighbouringTerritories("1", "india");
    game?.extractDefenderId({
      playerId: "1",
      name: "requestDefendingPlayer",
      data: {
        territoryId: "china",
      },
    });

    const response = await app.request("/game/troops-to-attack", {
      method: "POST",
      headers: {
        Cookie: `sessionId=1`,
      },
      body: JSON.stringify({ troops: 3 }),
    });

    assertEquals(await response.json(), { status: "success" });
  });
});

describe("fortificationHandler", () => {
  it("should move the user troops from one territory to another", async () => {
    const { app, gameManager } = createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");
    gameManager.handleGameActions({
      playerId: "1",
      name: "updateTroops",
      data: { territory: "india", troopCount: 10 },
    });

    const response = await app.request("/game/fortification", {
      method: "POST",
      headers: {
        Cookie: `sessionId=1`,
      },
      body: JSON.stringify({
        fromTerritory: "india",
        toTerritory: "nepal",
        troopCount: 10,
      }),
    });

    assertEquals(await response.json(), true);
  });

  it("should not move the troops to another territory if enough troop snot available", async () => {
    const { app, gameManager } = createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const response = await app.request("/game/fortification", {
      method: "POST",
      headers: {
        Cookie: `sessionId=1`,
      },
      body: JSON.stringify({
        fromTerritory: "india",
        toTerritory: "nepal",
        troopCount: 10,
      }),
    });

    assertEquals(await response.json(), false);
  });
});

describe("storeTroopsToDefend", () => {
  it("should return success message when defender select the troops to defend with ", async () => {
    const { app, gameManager } = createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const game = gameManager.findPlayerActiveGame("1");
    game?.getNeighbouringTerritories("1", "india");
    game?.extractDefenderId({
      playerId: "1",
      name: "requestDefendingPlayer",
      data: {
        territoryId: "china",
      },
    });

    const response = await app.request("/game/troops-to-defend", {
      method: "POST",
      headers: {
        Cookie: `sessionId=1`,
      },
      body: JSON.stringify({ troops: 2 }),
    });

    assertEquals(await response.json(), { status: "success" });
  });
});

describe("startFortification test", () => {
  it("should fire the fortification action to current user", async () => {
    const { app, gameManager } = createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");
    const response = await app.request("/game/start-fortification", {
      method: "GET",
      headers: {
        Cookie: `sessionId=1`,
      },
    });

    assertEquals(await response.json(), { actionStatus: true });
    assertEquals(
      gameManager.getGameActions("1", 0).actions.at(-1)?.name,
      "fortification"
    );
  });
});

describe("saveMessage", () => {
  it("should return 400 if message not given in request body", async () => {
    const { app } = createServerWithLoggedInUser("Jack");

    const response = await app.request("/game/messages", {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        Cookie: `sessionId=1`,
      },
    });

    assertEquals(response.status, 400);
    assertEquals(await response.json(), {
      messageStatus: false,
      error: "Message content is required",
    });
  });

  it("should send the message to all players", async () => {
    const { app, gameManager } = createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const response = await app.request("/game/messages", {
      method: "POST",
      body: JSON.stringify({ message: "Hello" }),
      headers: {
        Cookie: `sessionId=1`,
      },
    });

    const messages = gameManager.getMessages("1");

    assertEquals(response.status, 200);
    assertEquals(await response.json(), { messageStatus: true });
    assertEquals(messages, [
      {
        id: "1",
        message: "Hello",
        playerId: "1",
        recipientId: undefined,
        timestamp: 1,
      },
    ]);
  });

  it("should succesfully send the message to individual players", async () => {
    const { app, gameManager } = createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const response = await app.request("/game/messages", {
      method: "POST",
      body: JSON.stringify({ message: "Hello", recipientId: "1" }),
      headers: {
        Cookie: `sessionId=1`,
      },
    });

    const messages = gameManager.getPersonalMessages("1", 0);

    assertEquals(response.status, 200);
    assertEquals(await response.json(), { messageStatus: true });
    assertEquals(messages, [
      {
        id: "1",
        message: "Hello",
        playerId: "1",
        recipientId: "1",
        timestamp: 1,
      },
    ]);
  });
});

describe("getMessages", () => {
  it("should return the game messages", async () => {
    const { app, gameManager } = createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");
    gameManager.saveMessage("1", "hello");
    gameManager.saveMessage("3", "hello again");

    const response = await app.request("/game/messages", {
      method: "GET",
      headers: {
        Cookie: `sessionId=1`,
      },
    });

    assertEquals(await response.json(), {
      gameMessages: [
        {
          id: "1",
          message: "hello",
          playerId: "1",
          timestamp: 1,
        },
        {
          id: "1",
          message: "hello again",
          playerId: "3",
          timestamp: 1,
        },
      ],
      personalMessages: [],
    });
  });

  it("should return the direct messages", async () => {
    const { app, gameManager } = createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    gameManager.saveMessage("2", "hello", "1");
    gameManager.saveMessage("3", "hello again", "1");

    const response = await app.request("/game/messages", {
      method: "GET",
      headers: {
        Cookie: `sessionId=1`,
      },
    });

    assertEquals(await response.json(), {
      personalMessages: [
        {
          id: "1",
          message: "hello",
          playerId: "2",
          recipientId: "1",
          timestamp: 1,
        },
        {
          id: "1",
          message: "hello again",
          playerId: "3",
          recipientId: "1",
          timestamp: 1,
        },
      ],
      gameMessages: [],
    });
  });

  it("should return both public and direct messages", async () => {
    const { app, gameManager } = createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    gameManager.saveMessage("2", "hello", "1");
    gameManager.saveMessage("3", "hello again", "1");
    gameManager.saveMessage("2", "hello public");

    const response = await app.request("/game/messages", {
      method: "GET",
      headers: {
        Cookie: `sessionId=1`,
      },
    });

    assertEquals(await response.json(), {
      personalMessages: [
        {
          id: "1",
          message: "hello",
          playerId: "2",
          recipientId: "1",
          timestamp: 1,
        },
        {
          id: "1",
          message: "hello again",
          playerId: "3",
          recipientId: "1",
          timestamp: 1,
        },
      ],
      gameMessages: [
        {
          id: "1",
          message: "hello public",
          playerId: "2",
          timestamp: 1,
        },
      ],
    });
  });
});

describe("getGamePlayers", () => {
  it("should return the list of players in the game", async () => {
    const { app, gameManager, users } = createServerWithLoggedInUser("Jack");
    users.createUser("2", "url2");
    users.createUser("3", "url2");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const response = await app.request("/game/players", {
      method: "GET",
      headers: {
        Cookie: `sessionId=1`,
      },
    });

    assertEquals(response.status, 200);
    assertEquals(await response.json(), [
      { username: "Jack", avatar: "url", userId: "1" },
      { username: "2", avatar: "url2", userId: "2" },
      { username: "3", avatar: "url2", userId: "3" },
    ]);
  });
});
