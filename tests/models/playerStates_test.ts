import { assertEquals } from "assert";
import { describe, it } from "testing";
import { PlayerStates } from "../../src/models/playerStates.ts";

describe("initialize player state", () => {
  it("should initialize player states correctly", () => {
    const playerStates = new PlayerStates();
    const players = ["1", "2"];
    const territoryState = {
      india: { owner: "1", troops: 5 },
      pak: { owner: "1", troops: 3 },
      afg: { owner: "2", troops: 4 },
      ken: { owner: "2", troops: 6 },
    };

    const result = playerStates.initializePlayerStates(players, territoryState);

    const expected = {
      1: {
        territories: ["india", "pak"],
        continents: [],
        availableTroops: 21,
        cards: [],
      },
      2: {
        territories: ["afg", "ken"],
        continents: [],
        availableTroops: 21,
        cards: [],
      },
    };
    assertEquals(result, expected);
  });
});

describe("get player states", () => {
  it("should return the player states", () => {
    const playerStates = new PlayerStates();
    const players = ["1", "2"];
    const territoryState = {
      india: { owner: "1", troops: 5 },
      pak: { owner: "1", troops: 3 },
      afg: { owner: "2", troops: 4 },
      ken: { owner: "2", troops: 6 },
    };

    playerStates.initializePlayerStates(players, territoryState);
    const result = playerStates.getPlayerStates;

    assertEquals(result, {
      1: {
        territories: ["india", "pak"],
        continents: [],
        availableTroops: 21,
        cards: [],
      },
      2: {
        territories: ["afg", "ken"],
        continents: [],
        availableTroops: 21,
        cards: [],
      },
    });
  });
});

describe("update troops", () => {
  it("should update available troops for a player", () => {
    const playerStates = new PlayerStates();
    const players = ["1", "2"];
    const territoryState = {
      india: { owner: "1", troops: 5 },
      pak: { owner: "1", troops: 3 },
      afg: { owner: "2", troops: 4 },
      ken: { owner: "2", troops: 6 },
    };

    playerStates.initializePlayerStates(players, territoryState);
    const actual = playerStates.upadteTroops("1", 5);

    const expected = {
      territories: ["india", "pak"],
      continents: [],
      availableTroops: 16,
      cards: [],
    };
    assertEquals(actual, expected);
  });
});

describe("fetch reinforcements", () => {
  it("should fetch reinforcements with playerId", () => {
    const playerStates = new PlayerStates();
    const players = ["1", "2"];
    const territoryState = {
      india: { owner: "1", troops: 5 },
      pak: { owner: "1", troops: 3 },
      afg: { owner: "2", troops: 4 },
      ken: { owner: "2", troops: 6 },
    };

    playerStates.initializePlayerStates(players, territoryState);
    const result = playerStates.fetchReinforcements("1");

    assertEquals(result, { territories: ["india", "pak"], newTroops: 3 });
  });

  it("should return the reinforments with continent reinforcments", () => {
    const playerStates = new PlayerStates();
    const players = ["1", "2"];
    const territoryState = {
      india: { owner: "1", troops: 5 },
      pak: { owner: "1", troops: 3 },
      afg: { owner: "2", troops: 4 },
      ken: { owner: "2", troops: 6 },
    };

    playerStates.initializePlayerStates(players, territoryState);
    const continent = { name: "asia", extraTroops: 5 };
    playerStates.addContinent("1", continent);
    const result = playerStates.fetchReinforcements("1");

    assertEquals(result, { territories: ["india", "pak"], newTroops: 8 });
  });

  it("shoudl return reinforcements when territories are more than 12", () => {
    const playerStates = new PlayerStates();
    const players = ["1"];
    const territoryState = {
      india: { owner: "1", troops: 5 },
      pak: { owner: "1", troops: 3 },
      afg: { owner: "1", troops: 4 },
      ken: { owner: "1", troops: 6 },
      usa: { owner: "1", troops: 5 },
      china: { owner: "1", troops: 3 },
      russia: { owner: "1", troops: 4 },
      japan: { owner: "1", troops: 6 },
      brazil: { owner: "1", troops: 5 },
      argentina: { owner: "1", troops: 3 },
      france: { owner: "1", troops: 4 },
      germany: { owner: "1", troops: 6 },
    };
    playerStates.initializePlayerStates(players, territoryState);
    const result = playerStates.fetchReinforcements("1");
    assertEquals(result, {
      territories: [
        "india",
        "pak",
        "afg",
        "ken",
        "usa",
        "china",
        "russia",
        "japan",
        "brazil",
        "argentina",
        "france",
        "germany",
      ],
      newTroops: 4,
    });
  });
});

describe("player state", () => {
  it("should return the player state", () => {
    const playerStates = new PlayerStates();
    const players = ["1", "2"];
    const territoryState = {
      india: { owner: "1", troops: 5 },
      pak: { owner: "1", troops: 3 },
      afg: { owner: "2", troops: 4 },
      ken: { owner: "2", troops: 6 },
    };

    playerStates.initializePlayerStates(players, territoryState);
    const result = playerStates.playerState("1");

    assertEquals(result, {
      territories: ["india", "pak"],
      continents: [],
      availableTroops: 21,
      cards: [],
    });
  });
});

describe("add territory", () => {
  it("should add territory to player state", () => {
    const playerStates = new PlayerStates();
    const players = ["1", "2"];
    const territoryState = {
      india: { owner: "1", troops: 5 },
      pak: { owner: "1", troops: 3 },
      afg: { owner: "2", troops: 4 },
      ken: { owner: "2", troops: 6 },
    };
    playerStates.initializePlayerStates(players, territoryState);
    const territory = "usa";
    const playerId = "1";
    playerStates.addTerritory(playerId, territory);
    const expected = {
      territories: ["india", "pak", "usa"],
      continents: [],
      availableTroops: 21,
      cards: [],
    };
    assertEquals(playerStates.getPlayerStates[playerId], expected);
  });
});

describe("remove territory", () => {
  it("should remove territory from player state", () => {
    const playerStates = new PlayerStates();
    const players = ["1", "2"];
    const territoryState = {
      india: { owner: "1", troops: 5 },
      pak: { owner: "1", troops: 3 },
      afg: { owner: "2", troops: 4 },
      ken: { owner: "2", troops: 6 },
    };
    playerStates.initializePlayerStates(players, territoryState);
    const territory = "pak";
    const playerId = "1";
    const actual = playerStates.removeTerritory(playerId, territory);

    assertEquals(actual, ["india"]);
  });
});

describe("add continent", () => {
  it("should add a continent", () => {
    const playerStates = new PlayerStates();
    const players = ["1", "2"];
    const territoryState = {
      india: { owner: "1", troops: 5 },
      pak: { owner: "1", troops: 3 },
      afg: { owner: "2", troops: 4 },
      ken: { owner: "2", troops: 6 },
    };
    playerStates.initializePlayerStates(players, territoryState);
    const continent = { name: "asia", extraTroops: 5 };
    const playerId = "1";

    const actual = playerStates.addContinent(playerId, continent);
    assertEquals(actual, [{ name: "asia", extraTroops: 5 }]);
  });
});

describe("remove continent", () => {
  it("should remove a continent", () => {
    const playerStates = new PlayerStates();
    const players = ["1", "2"];
    const territoryState = {
      india: { owner: "1", troops: 5 },
      pak: { owner: "1", troops: 3 },
      afg: { owner: "2", troops: 4 },
      ken: { owner: "2", troops: 6 },
    };

    playerStates.initializePlayerStates(players, territoryState);
    const continent1 = { name: "asia", extraTroops: 5 };
    const continent2 = { name: "europe", extraTroops: 3 };
    const playerId = "1";
    playerStates.addContinent(playerId, continent1);
    playerStates.addContinent(playerId, continent2);
    const actual = playerStates.removeContinent(playerId, "asia");

    assertEquals(actual, [{ name: "europe", extraTroops: 3 }]);
  });
});

describe("add card", () => {
  it("should add a card to player state", () => {
    const playerStates = new PlayerStates();
    const players = ["1", "2"];
    const territoryState = {
      india: { owner: "1", troops: 5 },
      pak: { owner: "1", troops: 3 },
      afg: { owner: "2", troops: 4 },
      ken: { owner: "2", troops: 6 },
    };
    playerStates.initializePlayerStates(players, territoryState);
    const card = "cardType1";
    const playerId = "1";

    const actual = playerStates.addCard(playerId, card);

    assertEquals(actual, ["cardType1"]);
  });
});

describe("deduct cards", () => {
  it("should remove a card from player state", () => {
    const playerStates = new PlayerStates();
    const players = ["1", "2"];
    const territoryState = {
      india: { owner: "1", troops: 5 },
      pak: { owner: "1", troops: 3 },
      afg: { owner: "2", troops: 4 },
      ken: { owner: "2", troops: 6 },
    };
    playerStates.initializePlayerStates(players, territoryState);
    const playerId = "1";
    playerStates.addCard(playerId, "cardType1");
    playerStates.addCard(playerId, "cardType2");
    playerStates.addCard(playerId, "cardType3");
    const actual = playerStates.deductCards(playerId, [
      "cardType1",
      "cardType2",
    ]);

    assertEquals(actual, ["cardType3"]);
  });
});
