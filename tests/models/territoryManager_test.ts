import { assertEquals, assertThrows } from "assert";
import { describe, it } from "testing";

import { Continents, PlayerRegions, TerritoryState } from "../../src/types/gameTypes.ts";
import TerritoryManager from "../../src/models/territoryManager.ts";

const mockedContinents: Continents = {
  Asia: {
    bonusPoints: 7,
    territories: ["India", "Japan", "China"]
  },
  Alaska: {
    bonusPoints: 3,
    territories: ["Alberta"]
  }
};

const createTerritoryManagerInstance = (
  continents: Continents = mockedContinents,
  players: Set<string> = new Set(["1", "2", "3"])) => {
  const territoryManager = new TerritoryManager({ ...continents }, {});
  territoryManager.initialize(players);

  return territoryManager;
};

describe('initialize territory manager', () => {
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

describe('updateTroops', () => {
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

  it('should not decrease the troops count below zero', () => {
    const territoryManager = createTerritoryManagerInstance();
    const updatedTroopsCount = territoryManager.updateTroops('India', -3);

    assertEquals(updatedTroopsCount, 0);
  });
});

describe('getPlayerRegions', () => {
  const territoryManager = createTerritoryManagerInstance();
  const player1Regions: PlayerRegions = territoryManager.getPlayerRegions('1');
  const player2Regions: PlayerRegions = territoryManager.getPlayerRegions('2');
  const player3Regions: PlayerRegions = territoryManager.getPlayerRegions('3');

  assertEquals(player1Regions.continents, ["Alaska"]);
  assertEquals(player1Regions.territories, ["India", "Alberta"]);

  assertEquals(player2Regions.continents, []);
  assertEquals(player2Regions.territories, ["Japan"]);

  assertEquals(player3Regions.continents, []);
  assertEquals(player3Regions.territories, ["China"]);
});