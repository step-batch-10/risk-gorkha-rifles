import { describe, it } from "testing";
import { assertEquals, assertExists, assertNotEquals } from "assert";
import { RiskGame } from "../../src/core/risk.ts";
import { Continents } from "../../src/core/territoryManager.ts";

export const mockContinents = (): Continents => ({
  TestContinent: {
    bonusPoints: 3,
    territories: {
      "a": { neighbourTerritories: ["B"] },
      "b": { neighbourTerritories: ["a", "c"] },
      "c": { neighbourTerritories: ["b"] }
    }
  }
});

const identityShuffler = <T>(arr: T[]): T[] => [...arr];

const createTestRisk = RiskGame.createFactory({
  getContinents: mockContinents,
  shuffler: identityShuffler,
});

describe("RiskGame", () => {
  it("should create the risk instance from factory method", () => {
    const game = createTestRisk(["player1", "player2"]);
    assertExists(game);
  });

  it("should initialize without errors", () => {
    const game = createTestRisk(["player1", "player2"]);
    game.initialize();
    const state = game.territoryState();
    assertExists(state);
  });

  it("should assign all territories after initialization", () => {
    const game = createTestRisk(["p1", "p2"]);
    game.initialize();
    const state = game.territoryState();

    const allTerritories = Object.keys(state);
    assertEquals(allTerritories.length, 3);

    for (const territory of allTerritories) {
      const owner = state[territory].owner;
      assertExists(owner);
    }
  });

  it("should isolate territory state between game instances", () => {
    const game1 = createTestRisk(["p1", "p2"]);
    const game2 = createTestRisk(["x", "y"]);

    game1.initialize();
    const state1 = game1.territoryState();

    game2.initialize();
    const state2 = game2.territoryState();

    assertNotEquals(state1, state2);

    const owners1 = Object.values(state1).map(t => t.owner).sort();
    const owners2 = Object.values(state2).map(t => t.owner).sort();

    assertNotEquals(owners1.join(","), owners2.join(","));
  });
});
