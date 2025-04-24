import { assertEquals, assert, assertFalse } from "assert";
import { describe, it } from "testing";
import Game from "../../src/models/game.ts";

export const gameInstanceBuilder = () => {
  const continents = {
    NorthAmerica: ["alaska", "alberta"],
    SouthAmerica: ["brazil", "peru"],
  };
  const shuffler = (arr: string[]): string[] => arr;
  const uniqueId = (): string => "1";
  const timeStamp = (): number => 1;
  const game = new Game(
    new Set(["1", "2"]),
    continents,
    uniqueId,
    shuffler,
    timeStamp
  );
  return game;
};

describe("testing init", () => {
  it("should return the territory state after distributing troops", () => {
    const game = gameInstanceBuilder();
    const result = game.init();
    const expected1 = {
      alaska: { owner: "1", troops: 1 },
      alberta: { owner: "2", troops: 1 },
      brazil: { owner: "1", troops: 1 },
      peru: { owner: "2", troops: 1 },
    };

    assertEquals(result.territories, expected1);
  });
});

describe("getLastAction", () => {
  it("should return the last action with details", () => {
    const game = gameInstanceBuilder();
    game.init();
    const playerState = {
      "1": {
        territories: ["alaska", "brazil"],
        continents: [],
        availableTroops: 21,
        cards: [],
      },
      "2": {
        territories: ["alberta", "peru"],
        continents: [],
        availableTroops: 21,
        cards: [],
      },
    };
    const territoryState = {
      alaska: { owner: "1", troops: 1 },
      alberta: { owner: "2", troops: 1 },
      brazil: { owner: "1", troops: 1 },
      peru: { owner: "2", troops: 1 },
    };

    const expected = {
      id: "1",
      name: "startInitialDeployment",
      playerId: null,
      currentPlayer: "",
      data: {
        initialState: {
          "1": {
            availableTroops: 21,
            cards: [],
            continents: [],
            territories: ["alaska", "brazil"],
          },
          "2": {
            availableTroops: 21,
            cards: [],
            continents: [],
            territories: ["alberta", "peru"],
          },
        },
      },
      timeStamp: 1,
      playerStates: playerState,
      territoryState,
    };

    assertEquals(game.lastAction, expected);
  });
});

describe("tests for hasPlayer", () => {
  it("should return true when game has player", () => {
    const game = gameInstanceBuilder();

    assert(game.hasPlayer("1"));
  });

  it("should return false when game does not have player", () => {
    const game = gameInstanceBuilder();

    assertFalse(game.hasPlayer("3"));
  });
});

describe("tests for updateTerritoryTroops", () => {
  it("should return updated troops when valid territory and troop count is given", () => {
    const game = gameInstanceBuilder();
    game.init();
    const actual = game.updateTroops("1", "peru", 1);
    assertEquals(actual?.territory, { owner: "2", troops: 2 });
  });

  it("should return updated troops when valid territory and troop count is given", () => {
    const game = gameInstanceBuilder();
    game.init();
    const actual = game.updateTroops("2", "peru", -1);
    assertEquals(actual?.territory, { owner: "2", troops: 0 });
  });

  it("should return null when invalid territory is given", () => {
    const game = gameInstanceBuilder();
    game.init();
    const actual = game.updateTroops("1", "India", 2);
    assertEquals(actual, null);
  });
});

describe("tests for isDeploymentOver", () => {
  it("should return true when deployment for current player id is over", () => {
    const game = gameInstanceBuilder();
    game.init();
    game.updateTroops("2", "peru", 21);
    const actual = game.isDeploymentOver("2");
    assert(actual);
  });

  it("should return false when deployment for current player id is not over", () => {
    const game = gameInstanceBuilder();
    game.init();
    game.updateTroops("2", "peru", 1);
    const actual = game.isDeploymentOver("2");
    assertFalse(actual);
  });
});
