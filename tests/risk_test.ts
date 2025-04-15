import { assertEquals } from "assert";
import { describe, it } from "testing";
import Risk from "../src/models/risk.ts";

describe('tests for risk model', () => {
  it("should initialize the territoryState data member", () => {
    const risk = new Risk();
    risk.addPlayer("1", "player1");
    risk.addPlayer("2", "player2");
    risk.addPlayer("3", "player3");
    risk.addPlayer("4", "player4");
    risk.addPlayer("5", "player5");
    risk.addPlayer("6", "player6");
    risk.init();

    assertEquals(Object.keys(risk.territoryState).length, 42);
  });

  it("should not initialize risk instance if not 6 players joined", () => {
    const risk = new Risk();
    risk.addPlayer("1", "player1");
    risk.addPlayer("2", "player2");
    risk.addPlayer("3", "player3");
    risk.addPlayer("4", "player4");
    risk.init();

    assertEquals(Object.keys(risk.territoryState).length, 0);
  });
});