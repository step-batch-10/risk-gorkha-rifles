import { assertEquals, assertThrows } from "assert";
import { describe, it } from "testing";

import { PlayerRegions, TerritoryState } from "../../src/types/gameTypes.ts";
import TerritoryManager, { Continents } from "../../src/models/territoryManager.ts";

const mockedContinents: Continents = {
  Asia: {
    bonusPoints: 7,
    territories: {
      India: {
        neighbourTerritories: ["China", "Alberta"]
      },
      Japan: {
        neighbourTerritories: ["China"]
      },
      China: {
        neighbourTerritories: ["India", "Japan"]
      }
    }
  },
  Alaska: {
    bonusPoints: 3,
    territories: {
      Alberta: {
        neighbourTerritories: ["India"]
      }
    }
  }
};

const createTerritoryManagerInstance = (
  continents: Continents = mockedContinents,
  players: Set<string> = new Set(["1", "2", "3"])) => {
  const territoryManager = new TerritoryManager({ ...continents });
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

describe('getContinentBonus', () => {
  it('should return the valid continent bonus', () => {
    const territoryManager = createTerritoryManagerInstance();

    assertEquals(territoryManager.getContinentBonus('Asia'), 7);
    assertEquals(territoryManager.getContinentBonus('Alaska'), 3);
  });

  it('should throw an error if continent is not valid ', () => {
    assertThrows(() => {

      const territoryManager = createTerritoryManagerInstance();
      territoryManager.getContinentBonus('unknown');
    });
  });
});

describe('getConnectedTerritories', () => {
  it('should find the connected territories', () => {
    const gameManager = createTerritoryManagerInstance();
    const connectedTerritories = gameManager.getConnectedTerritories("India");

    assertEquals(connectedTerritories, ["Alberta"]);
  });

  it('should throw an error for unknown territory', () => {
    const gameManager = createTerritoryManagerInstance();

    assertThrows(() => {
      gameManager.getConnectedTerritories("unknown");
    });
  });
});

describe('getNeighbouringTerritories', () => {
  it('should find the neighbouring territories of other players', () => {
    const gameManager = createTerritoryManagerInstance();
    const indiaNeighbours = gameManager.getNeighbouringTerritories("India");
    const chinaNeighbours = gameManager.getNeighbouringTerritories("China");

    assertEquals(indiaNeighbours, ["China"]);
    assertEquals(chinaNeighbours, ["India", "Japan"]);
  });
});