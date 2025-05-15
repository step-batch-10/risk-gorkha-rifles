import { assertEquals, assertThrows } from "assert";
import { describe, it } from "testing";

import { Continent, TerritoryState } from "../../src/types/gameTypes.ts";
import TerritoryManager from "../../src/models/territoryManager.ts";

const mockedContinents: Continent = {
  Asia: ["India", "Japan", "China"],
  Alska: ["Alberta"]
};

const createTerritoryManagerInstance = (
  continents: Continent = mockedContinents,
  players: Set<string> = new Set(["1", "2", "3"])) => {
  const territoryManager = new TerritoryManager({ ...continents }, {});
  territoryManager.initialize(players);

  return territoryManager;
};

describe('initializeTerritoryManager', () => {
  it('should distribute territories equally', () => {
    const territoryManager = createTerritoryManagerInstance();

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

    assertEquals(territoryManager.getTerritoryState(), expectedTerritoryState);
  });
});

describe('should update the territoryTroops', () => {
  it('should increase the territory troops count', () => {
    const territoryManager = createTerritoryManagerInstance();
    const updatedTroopsCount = territoryManager.updateTroops('India', 12);

    assertEquals(updatedTroopsCount, 13);
  });

  it('should able to hanlde 0', () => {
    const territoryManager = createTerritoryManagerInstance();
    const updatedTroopsCount = territoryManager.updateTroops('India', 0);

    assertEquals(updatedTroopsCount, 1);
  });

  it('should not update the troops in invalid territory', () => {
    const territoryManager = createTerritoryManagerInstance();

    assertThrows(() => {
      territoryManager.updateTroops('unknown', 12);
    });
  });

  it('should decrease the troops count', () => {
    const territoryManager = createTerritoryManagerInstance();
    const updatedTroopsCount = territoryManager.updateTroops('India', -1);

    assertEquals(updatedTroopsCount, 0);
  });
});