import { assertEquals } from "assert";
import { describe, it } from "testing";

import { Continent, TerritoryState } from "../../src/types/gameTypes.ts";
import TerritoryManager from "../../src/models/territoryManager.ts";

const continents: Continent = {
  Asia: ["India", "Japan", "China"],
  Alska: ["Alberta"]
};

describe('initializeTerritoryManager', () => {
  it('should distribute territories equally', () => {
    const players = new Set(["1", "2", "3"]);
    const territoryManager = new TerritoryManager(continents, {});
    const territoryState = territoryManager.initialize(players);

    const expectedTerritoryState: TerritoryState = {
      "India": {
        owner: "1",
        troops: 1
      },
      "Japan": {
        owner: "2",
        troops: 1
      },
      "China": {
        owner: "3",
        troops: 1
      },
      "Alberta": {
        owner: "1",
        troops: 1
      }
    };

    assertEquals(territoryState, expectedTerritoryState);
  });
});