import { assertEquals, assert, assertFalse } from "assert";
import { describe, it } from "testing";
import Game, { ActionDetails } from "../../src/models/game.ts";
import { neighbouringTerritories } from "../../src/utils/continents.ts";

export const gameInstanceBuilder = () => {
  const continents = {
    NorthAmerica: ["alaska", "alberta"],
    SouthAmerica: ["brazil", "peru"],
  };
  const shuffler = (arr: string[]): string[] => arr;
  const uniqueId = (): string => "1";
  const timeStamp = (): number => 1;
  const connectedTerritories = neighbouringTerritories();

  const game = new Game(
    new Set(["1", "2"]),
    continents,
    uniqueId,
    shuffler,
    timeStamp,
    connectedTerritories,
    [],
    ["red", "green", "yellow"]
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

  it("should update players with their colours", () => {
    const game = gameInstanceBuilder();
    game.init();
    const expected = [
      { id: "1", colour: "red" },
      { id: "2", colour: "green" },
    ];

    assertEquals(game.playersData, expected);
  });

  it("should return player state after distributing troops", () => {
    const game = gameInstanceBuilder();
    const actual = game.init();
    const expected = {
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

    assertEquals(actual.players, expected);
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
      to: null,
      currentPlayer: "",
      data: { troopCount: 21 },
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
    const actionDetails = {
      playerId: "1",
      name: "updateTroops",
      data: {
        territory: "peru",
        troopCount: 2,
      },
    };
    const actual = game.updateTroops(actionDetails);
    assertEquals(actual?.territory, { owner: "2", troops: 3 });
  });

  it("should return updated troops when valid territory and troop count is given", () => {
    const game = gameInstanceBuilder();
    game.init();
    const actionDetails = {
      playerId: "1",
      name: "updateTroops",
      data: {
        territory: "peru",
        troopCount: 10,
      },
    };
    const actual = game.updateTroops(actionDetails);
    assertEquals(actual?.territory, { owner: "2", troops: 11 });
  });

  it("should return null when invalid territory is given", () => {
    const game = gameInstanceBuilder();
    game.init();
    const actionDetails = {
      playerId: "1",
      name: "updateTroops",
      data: {
        territory: "Invalid",
        troopCount: 10,
      },
    };
    const actual = game.updateTroops(actionDetails);
    assertEquals(actual, null);
  });
});

describe("tests for isDeploymentOver", () => {
  it("should return true when deployment for current player id is over", () => {
    const game = gameInstanceBuilder();
    game.init();
    game.updateTroops({
      playerId: "1",
      name: "updateTroops",
      data: {
        territory: "brazil",
        troopCount: 21,
      },
    });
    game.updateTroops({
      playerId: "2",
      name: "updateTroops",
      data: {
        territory: "peru",
        troopCount: 21,
      },
    });
    const actual = game.startGame();
    assertEquals(actual, { status: true });
  });

  it("should return false when deployment for current player id is not over", () => {
    const game = gameInstanceBuilder();
    game.init();
    const actionDetails = {
      playerId: "1",
      name: "updateTroops",
      data: {
        territory: "peru",
        troopCount: 10,
      },
    };

    game.updateTroops(actionDetails);
    const actual = game.startGame();
    assertEquals(actual, { status: false });
  });
});

describe("tests for playerTerritories", () => {
  it("should return territories of the player", () => {
    const game = gameInstanceBuilder();
    game.init();

    assertEquals(game.playerTerritories("1"), ["alaska", "brazil"]);
    assertEquals(game.playerTerritories("2"), ["alberta", "peru"]);
  });
});

describe("test for neighbouringTerritories", () => {
  it("should return the neighbouring Territories which is not owned by attacker", () => {
    const game = gameInstanceBuilder();
    game.init();

    assertEquals(game.neighbouringTerritories("1", "alaska"), ["alberta"]);
    assertEquals(game.neighbouringTerritories("1", "brazil"), ["peru"]);
  });
});

describe("test for gameDefender", () => {
  it("should return the id of defending player", () => {
    const game = gameInstanceBuilder();
    game.init();

    assertEquals(game.gameDefender("brazil", "1"), "1");
    assertEquals(game.gameDefender("alaska", "1"), "1");
    assertEquals(game.gameDefender("alberta", "2"), "2");
    assertEquals(game.gameDefender("peru", "2"), "2");
    assertEquals(game.gameDefender("india", "3748"), "player not found");
  });
});

describe("test for storeTroopsToAttack", () => {
  it("should return the success message", () => {
    const game = gameInstanceBuilder();
    game.init();
    const actionDetails = {
      playerId: "1",
      name: "storeTroops",
      data: {
        troops: 1,
      },
    };

    assertEquals(game.storeTroops(actionDetails), {
      status: "success",
    });
  });
});

describe("test for storeTroopsToDefend", () => {
  it("should return the success message", () => {
    const game = gameInstanceBuilder();
    game.init();
    const actionDetails = {
      playerId: "1",
      name: "storeTroops",
      data: {
        troops: 1,
      },
    };

    const actionDetails2 = {
      playerId: "2",
      name: "storeTroops",
      data: {
        troops: 1,
      },
    };

    game.storeTroops(actionDetails2);

    assertEquals(game.storeTroops(actionDetails), {
      status: "success",
    });
  });
});

describe("Game - fortification", () => {
  it("should transfer troops from one territory to another", () => {
    const game = gameInstanceBuilder();
    game.init();

    const actionDetails: ActionDetails = {
      playerId: "1",
      name: "fortification",
      data: {
        fromTerritory: "alaska",
        toTerritory: "peru",
        troopCount: 5,
      },
    };

    game.updateTroops({
      playerId: "1",
      name: "updateTroops",
      data: { territory: "alaska", troopCount: 10 },
    });

    const result = game.fortification(actionDetails);

    assertEquals(result, true);
    assertEquals(game.getTerritoryState(), {
      alaska: {
        owner: "1",
        troops: 6,
      },
      alberta: {
        owner: "2",
        troops: 1,
      },
      brazil: {
        owner: "1",
        troops: 1,
      },
      peru: {
        owner: "2",
        troops: 6,
      },
    });
    assertEquals(game.gameActions.at(-1)?.name, "updateTroops");
    assertEquals(game.gameActions.at(-1)?.data, {
      territory: "peru",
      troopCount: 6,
      troopDeployed: 5,
    }); 
  });

  it("should not transfer troops if insufficient troops in the source territory", () => {
    const game = gameInstanceBuilder();
    game.init();

    const actionDetails: ActionDetails = {
      playerId: "1",
      name: "fortification",
      data: {
        fromTerritory: "alaska",
        toTerritory: "brazil",
        troopCount: 5,
      },
    };

    const result = game.fortification(actionDetails);

    assertEquals(result, false);
    assertEquals(game.getTerritoryState(), {
      alaska: { owner: "1", troops: 1 },
      alberta: { owner: "2", troops: 1 },
      brazil: { owner: "1", troops: 1 },
      peru: { owner: "2", troops: 1 },
    });
  });
});

describe("Game - getConnectedTerritories", () => {
  it("should find the connected territories of a player", () => {
    const continents = {
      NorthAmerica: ["alaska", "brazil", "dummy"],
      SouthAmerica: ["alberta", "peru", "lorem"],
    };
    const shuffler = (arr: string[]): string[] => arr;
    const uniqueId = (): string => "1";
    const timeStamp = (): number => 1;
    const connectedTerritories = {
      alaska: ["dummy", "brazil", "lorem"],
      dummy: ["peru", "alberta"],
      brazil: ["alaska", "lorem"],
      alberta: ["dummy"],
      peru: ["dummy"],
      lorem: ["alaska"],
    };

    const game = new Game(
      new Set(["1", "2"]),
      continents,
      uniqueId,
      shuffler,
      timeStamp,
      connectedTerritories,
      ["red", "green", "yellow"]
    );
    game.init();

    const action: ActionDetails = {
      playerId: "1",
      name: "connectedTerritories",
      data: { territoryId: "alaska" },
    };

    assertEquals(game.getConnectedTerritories(action), [
      "alaska",
      "dummy",
      "peru",
    ]);
  });
});
