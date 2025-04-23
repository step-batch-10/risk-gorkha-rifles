import { assert, assertEquals } from "assert";
import { describe, it } from "testing";
import GameManager from "../../src/models/gameManager.ts";
import Game from "../../src/models/game.ts";
import { Continent, GameStatus } from "../../src/types/game.ts";

export const gameManagerInstanceBuilder = () => {
  const uniqueId = (): string => "1";
  const getContinents = (): Continent => ({ Asia: ["India"] });
  const gameManager = new GameManager(uniqueId, getContinents, () => 1);
  return gameManager;
};

describe("find player active game", () => {
  it("should return player active game", () => {
    const gameManager = gameManagerInstanceBuilder();
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("3", "3");
    gameManager.allotPlayer("2", "3");

    const result = gameManager.findPlayerActiveGame("1");
    assert(result instanceof Game);
  });
  it("should return undefined when player is not in active game", () => {
    const gameManager = gameManagerInstanceBuilder();

    const result = gameManager.findPlayerActiveGame("4");
    assertEquals(result, undefined);
  });
});

describe("allotPlayer method", () => {
  it("should return updated waiting list when players are allotted", () => {
    const gameManager = gameManagerInstanceBuilder();
    assertEquals(gameManager.allotPlayer("1", "3"), new Set(["1"]));
    assertEquals(gameManager.allotPlayer("2", "3"), new Set(["1", "2"]));
    assertEquals(gameManager.allotPlayer("3", "3"), new Set([]));
  });

  it("should create a game instance when 3 players assigned", () => {
    const gameManager = gameManagerInstanceBuilder();
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const gameInstance = gameManager.findPlayerActiveGame("3");
    assert(gameInstance instanceof Game);
  });
});

describe("getGameActions test", () => {
  it("should return all actions after the timestamp", () => {
    const gameManager = gameManagerInstanceBuilder();
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");
    const game = gameManager.findPlayerActiveGame("3");
    game?.init();
    const actual = gameManager.getGameActions("3", 0);
    const expected = {
      status: GameStatus.running,
      currentPlayer: "3",
      actions: [
        {
          id: "1",
          name: "initialDeploymentStart",
          playerId: null,
          currentPlayer: "",
          data: { troopsCount: 21 },
          timeStamp: 1,
          territoryState: { India: { owner: "1", troops: 1 } },
        },
      ],
      players: ["1", "2", "3"],
    };
    assertEquals(actual, expected);
  });

  it("should return empty actions when actions are", () => {
    const gameManager = gameManagerInstanceBuilder();
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const actual = gameManager.getGameActions("3", 0);
    const expected = {
      status: GameStatus.running,
      currentPlayer: "3",
      actions: [],
      players: ["1", "2", "3"],
    };
    assertEquals(actual, expected);
  });

  it("should return true with player list when in waiting lobby", () => {
    const gameManager = gameManagerInstanceBuilder();
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");

    assertEquals(gameManager.waitingStatus("1"), {
      status: true,
      players: ["1", "2"],
    });
  });

  it("should return true with player list when in waiting lobby", () => {
    const gameManager = gameManagerInstanceBuilder();
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    assertEquals(gameManager.waitingStatus("3"), {
      status: false,
      players: [],
    });
  });
});
