import { assert, assertEquals, assertThrows } from "assert";
import { describe, it } from "testing";
import GameManager from "../../src/models/gameManager.ts";
import Game from "../../src/models/game.ts";
import { GameStatus } from "../../src/types/gameTypes.ts";
import { neighbouringTerritories } from "../../src/utils/continents.ts";

const iterator = () => {
  let i = 1;
  return () => i++;
};

export const gameManagerInstanceBuilder = (
  getContinents: () => Record<string, string[]>
) => {
  const uniqueId = (): string => "1";
  const shuffler = (ar: string[]): string[] => ar;
  const connectedTerritories = neighbouringTerritories();
  const gameManager = new GameManager(
    uniqueId,
    getContinents,
    iterator(),
    shuffler,
    connectedTerritories
  );
  return gameManager;
};

describe("find player active game", () => {
  it("should return player active game", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({ Asia: ["India"] }));
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const result = gameManager.findPlayerActiveGame("1");
    assert(result instanceof Game);
  });
  it("should return undefined when player is not in active game", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({ Asia: ["India"] }));
    const result = gameManager.findPlayerActiveGame("4");
    assertEquals(result, undefined);
  });
});

describe("allotPlayer method", () => {
  it("should return updated waiting list when players are allotted", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({ Asia: ["India"] }));
    assertEquals(gameManager.allotPlayer("1", "3"), new Set(["1"]));
    assertEquals(gameManager.allotPlayer("2", "3"), new Set(["1", "2"]));
    assertEquals(gameManager.allotPlayer("3", "3"), new Set([]));
  });

  it("should create a game instance when 3 players assigned", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({ Asia: ["India"] }));
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const gameInstance = gameManager.findPlayerActiveGame("3");
    assert(gameInstance instanceof Game);
  });
});

describe("getGameActions test", () => {
  it("should return  actions when actions are present", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({ Asia: ["India"] }));
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const actual = gameManager.getGameActions("3", 0);
    const expected = {
      status: GameStatus.running,
      userId: "3",
      actions: [
        {
          id: "1",
          name: "startInitialDeployment",
          playerId: null,
          to: null,
          currentCavalryPos: 0,
          bonusTroops: [0, 10, 20, 30, 40, 50, 60],
          data: {
            newTroops: 21,
          },
          currentPlayer: "",
          playerStates: {
            "1": {
              availableTroops: 21,
              cards: ["infantry", "infantry", "infantry"],
              continents: [],
              territories: ["India"],
            },
            "2": {
              availableTroops: 21,
              cards: ["infantry", "infantry", "infantry"],
              continents: [],
              territories: [],
            },
            "3": {
              availableTroops: 21,
              cards: ["infantry", "infantry", "infantry"],
              continents: [],
              territories: [],
            },
          },
          territoryState: {
            India: {
              owner: "1",
              troops: 1,
            },
          },
          timeStamp: 1,
        },
      ],
      players: [
        { id: "1", colour: "#50C878" },
        { id: "2", colour: "#DAA520" },
        { id: "3", colour: "#FF7F50" },
      ],
    };

    assertEquals(actual, expected);
  });

  it("should return actions after the time stamp", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({ Asia: ["India"] }));
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    gameManager.handleGameActions({
      playerId: "1",
      name: "updateTroops",
      data: { territory: "India", troopCount: 10 },
    });
    const actual = gameManager.getGameActions("3", 1);
    const expected = {
      status: GameStatus.running,
      userId: "3",
      actions: [
        {
          currentPlayer: "",
          currentCavalryPos: 0,
          bonusTroops: [0, 10, 20, 30, 40, 50, 60],
          data: {
            territory: "India",
            troopCount: 11,
            troopDeployed: 10,
          },
          id: "1",
          name: "updateTroops",
          playerId: "1",
          to: null,
          playerStates: {
            "1": {
              availableTroops: 11,
              cards: ["infantry", "infantry", "infantry"],
              continents: [],
              territories: ["India"],
            },
            "2": {
              availableTroops: 21,
              cards: ["infantry", "infantry", "infantry"],
              continents: [],
              territories: [],
            },
            "3": {
              availableTroops: 21,
              cards: ["infantry", "infantry", "infantry"],
              continents: [],
              territories: [],
            },
          },
          territoryState: {
            India: {
              owner: "1",
              troops: 11,
            },
          },
          timeStamp: 2,
        },
      ],
      players: [
        { id: "1", colour: "#50C878" },
        { id: "2", colour: "#DAA520" },
        { id: "3", colour: "#FF7F50" },
      ],
    };
    assertEquals(actual, expected);
  });

  it("should return actions when action reciever is null", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({ Asia: ["India"] }));
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    gameManager.handleGameActions({
      playerId: "1",
      name: "updateTroops",
      data: { territory: "India", troopCount: 10 },
    });
    const actual = gameManager.getGameActions("3", 1);
    const expected = {
      status: GameStatus.running,
      userId: "3",
      actions: [
        {
          currentPlayer: "",
          currentCavalryPos: 0,
          bonusTroops: [0, 10, 20, 30, 40, 50, 60],
          data: {
            territory: "India",
            troopCount: 11,
            troopDeployed: 10,
          },
          id: "1",
          name: "updateTroops",
          playerId: "1",
          to: null,
          playerStates: {
            "1": {
              availableTroops: 11,
              cards: ["infantry", "infantry", "infantry"],
              continents: [],
              territories: ["India"],
            },
            "2": {
              availableTroops: 21,
              cards: ["infantry", "infantry", "infantry"],
              continents: [],
              territories: [],
            },
            "3": {
              availableTroops: 21,
              cards: ["infantry", "infantry", "infantry"],
              continents: [],
              territories: [],
            },
          },
          territoryState: {
            India: {
              owner: "1",
              troops: 11,
            },
          },
          timeStamp: 2,
        },
      ],
      players: [
        { id: "1", colour: "#50C878" },
        { id: "2", colour: "#DAA520" },
        { id: "3", colour: "#FF7F50" },
      ],
    };
    assertEquals(actual, expected);
  });

  it("should return actions when action reciever is the player who requested the action", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({
      Asia: ["India", "China", "Nepal"],
    }));
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    gameManager.handleGameActions({
      playerId: "1",
      name: "updateTroops",
      data: { territory: "India", troopCount: 21 },
    });

    gameManager.handleGameActions({
      playerId: "2",
      name: "updateTroops",
      data: { territory: "China", troopCount: 21 },
    });

    gameManager.handleGameActions({
      playerId: "3",
      name: "updateTroops",
      data: { territory: "Nepal", troopCount: 21 },
    });

    gameManager.handleGameActions({
      playerId: "1",
      name: "startGame",
      data: {},
    });

    const actual = gameManager.getGameActions("1", 6);
    const expected = {
      status: GameStatus.running,
      userId: "1",
      players: [
        { id: "1", colour: "#50C878" },
        { id: "2", colour: "#DAA520" },
        { id: "3", colour: "#FF7F50" },
      ],
      actions: [
        {
          currentPlayer: "1",
          currentCavalryPos: 0,
          bonusTroops: [0, 10, 20, 30, 40, 50, 60],
          data: {},
          id: "1",
          name: "reinforcementPhase",
          playerId: "1",
          to: "1",
          playerStates: {
            "1": {
              availableTroops: 0,
              cards: ["infantry", "infantry", "infantry"],
              continents: [],
              territories: ["India"],
            },
            "2": {
              availableTroops: 0,
              cards: ["infantry", "infantry", "infantry"],
              continents: [],
              territories: ["China"],
            },
            "3": {
              availableTroops: 0,
              cards: ["infantry", "infantry", "infantry"],
              continents: [],
              territories: ["Nepal"],
            },
          },
          territoryState: {
            China: {
              owner: "2",
              troops: 22,
            },
            India: {
              owner: "1",
              troops: 22,
            },
            Nepal: {
              owner: "3",
              troops: 22,
            },
          },
          timeStamp: 7,
        },
      ],
    };
    assertEquals(actual, expected);
  });

  it("should return actions when action reciever is the player who requested the action", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({
      Asia: ["India", "China", "Nepal"],
    }));
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    gameManager.handleGameActions({
      playerId: "1",
      name: "updateTroops",
      data: { territory: "India", troopCount: 21 },
    });

    gameManager.handleGameActions({
      playerId: "2",
      name: "updateTroops",
      data: { territory: "China", troopCount: 21 },
    });

    gameManager.handleGameActions({
      playerId: "3",
      name: "updateTroops",
      data: { territory: "Nepal", troopCount: 21 },
    });

    gameManager.handleGameActions({
      playerId: "1",
      name: "startGame",
      data: {},
    });

    const actual = {
      status: GameStatus.running,
      userId: "1",
      players: [
        { id: "1", colour: "#50C878" },
        { id: "2", colour: "#DAA520" },
        { id: "3", colour: "#FF7F50" },
      ],
      actions: [
        {
          currentPlayer: "1",
          data: {
            territory: "India",
            troopCount: 11,
            troopDeployed: 10,
          },
          id: "1",
          name: "updateTroops",
          playerId: null,
          to: "1",
          playerStates: {
            "1": {
              availableTroops: 11,
              cards: ["infantry", "infantry", "infantry"],
              continents: [],
              territories: ["India"],
            },
            "2": {
              availableTroops: 21,
              cards: ["infantry", "infantry", "infantry"],
              continents: [],
              territories: [],
            },
            "3": {
              availableTroops: 21,
              cards: ["infantry", "infantry", "infantry"],
              continents: [],
              territories: [],
            },
          },
          territoryState: {
            India: {
              owner: "1",
              troops: 11,
            },
          },
          timeStamp: 2,
        },
      ],
    };
    const expected = {
      status: GameStatus.running,
      userId: "1",
      players: [
        { id: "1", colour: "#50C878" },
        { id: "2", colour: "#DAA520" },
        { id: "3", colour: "#FF7F50" },
      ],
      actions: [
        {
          currentPlayer: "1",
          data: {
            territory: "India",
            troopCount: 11,
            troopDeployed: 10,
          },
          id: "1",
          name: "updateTroops",
          playerId: null,
          to: "1",
          playerStates: {
            "1": {
              availableTroops: 11,
              cards: ["infantry", "infantry", "infantry"],
              continents: [],
              territories: ["India"],
            },
            "2": {
              availableTroops: 21,
              cards: ["infantry", "infantry", "infantry"],
              continents: [],
              territories: [],
            },
            "3": {
              availableTroops: 21,
              cards: ["infantry", "infantry", "infantry"],
              continents: [],
              territories: [],
            },
          },
          territoryState: {
            India: {
              owner: "1",
              troops: 11,
            },
          },
          timeStamp: 2,
        },
      ],
    };
    assertEquals(actual, expected);
  });

  it("should return empty actions when actions are", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({ Asia: ["India"] }));
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");

    const actual = gameManager.getGameActions("3", 0);
    const expected = {
      status: undefined,
      userId: "3",
      actions: [],
      players: undefined,
    };
    assertEquals(actual, expected);
  });

  it("should return true with player list when in waiting lobby", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({ Asia: ["India"] }));
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");

    assertEquals(gameManager.waitingStatus("1"), {
      status: true,
      players: ["1", "2"],
    });
  });

  it("should return true with player list when in waiting lobby", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({ Asia: ["India"] }));
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    assertEquals(gameManager.waitingStatus("3"), {
      status: false,
      players: [],
    });
  });
});

describe("handleGameActions test", () => {
  it("should return updated troops in territory", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({ Asia: ["India"] }));
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const actual = gameManager.handleGameActions({
      playerId: "1",
      name: "updateTroops",
      data: {
        territory: "India",
        troopCount: 1,
      },
    });

    const expected = { owner: "1", troops: 2 };
    assertEquals(actual.territory, expected);
  });
  it("should return isDeploymentOver as false", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({ Asia: ["India"] }));

    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const actual = gameManager.handleGameActions({
      name: "startGame",
      playerId: "3",
      data: {},
    });

    assertEquals(actual, { status: false });
  });

  it("should return isDeploymentOver as true", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({
      Asia: ["India", "China", "Nepal"],
    }));
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");
    gameManager.handleGameActions({
      name: "updateTroops",
      playerId: "1",
      data: {
        territory: "India",
        troopCount: 21,
      },
    });
    gameManager.handleGameActions({
      name: "updateTroops",
      playerId: "2",
      data: {
        territory: "China",
        troopCount: 21,
      },
    });
    gameManager.handleGameActions({
      name: "updateTroops",
      playerId: "3",
      data: {
        territory: "Nepal",
        troopCount: 21,
      },
    });
    const actual = gameManager.handleGameActions({
      name: "startGame",
      playerId: "3",
      data: {},
    });
    assertEquals(actual, { status: true });
  });

  it("should throw when game not found ", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({ Asia: ["India"] }));
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");

    assertThrows(() => {
      gameManager.handleGameActions({
        name: "isDeploymentOver",
        playerId: "1",
        data: {},
      });
    });
  });

  it("should return the territories of the player for attack request", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({ Asia: ["India"] }));
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");
    const actual = gameManager.handleGameActions({
      name: "requestAttack",
      playerId: "1",
      data: {},
    });
    gameManager.handleGameActions({
      name: "updateTroops",
      playerId: "1",
      data: { territoryId: "india", troopsCount: 3 },
    });

    assertEquals(actual, []);
  });

  it("should return the territories of the player for reinforcement request", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({ Asia: ["India"] }));
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");
    const actual = gameManager.handleGameActions({
      name: "reinforceRequest",
      playerId: "1",
      data: { cards: [] },
    });

    const expected = {
      newTroops: 3,
      territories: ["India"],
    };

    assertEquals(actual, expected);
  });
  it("should return the reinforcement data for reinforcement request when player has more than 9 territories", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({
      Asia: "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27".split(
        " "
      ),
    }));
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const actual = gameManager.handleGameActions({
      name: "reinforceRequest",
      playerId: "1",
      data: { cards: [] },
    });

    const expected = {
      newTroops: 3,
      territories: "1 4 7 10 13 16 19 22 25".split(" "),
    };

    assertEquals(actual, expected);
  });

  it("should return the reinforcement data for reinforcement request when player has more than 9 territories", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({
      Asia: ["India"],
    }));
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const gameInstance = gameManager.findPlayerActiveGame("1");
    const playerStates = gameInstance?.playerState;

    playerStates?.["1"].continents.push({ name: "Asia", extraTroops: 7 });

    const actual = gameManager.handleGameActions({
      name: "reinforceRequest",
      playerId: "1",
      data: { cards: [] },
    });

    const expected = {
      newTroops: 10,
      territories: ["India"],
    };

    assertEquals(actual, expected);
  });

  it("should return neighbouring territories for given territory", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({
      Asia: ["India"],
    }));
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");
    const actual = gameManager.handleGameActions({
      name: "requestNeighbouringTerritories",
      playerId: "1",
      data: {
        territoryId: "india",
      },
    });
    assertEquals(actual, []);
  });

  it("should return the player id of the given territory", () => {
    const gameManager = gameManagerInstanceBuilder(() => ({
      Asia: ["India"],
    }));
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const actual = gameManager.handleGameActions({
      name: "requestDefendingPlayer",
      playerId: "2",
      data: {
        territoryId: "India",
      },
    });

    assertEquals(actual, "1");
  });
});
