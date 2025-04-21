import { assertEquals } from "assert";
import { describe, it } from "jsr:@std/testing/bdd";
import Risk from "../../src/models/risk.ts";

describe("tests for risk model", () => {
  it("should initialize the territoryState data member", () => {
    const risk = new Risk(3, () => "1");
    risk.addPlayer("1", "player1");
    risk.addPlayer("2", "player2");
    risk.addPlayer("3", "player3");
    risk.init();

    assertEquals(risk.territoryState.size, 42);
  });

  it("should not initialize risk instance if not 6 players joined", () => {
    const risk = new Risk(6, () => "1");
    risk.addPlayer("1", "player1");
    risk.addPlayer("2", "player2");
    risk.addPlayer("3", "player3");
    risk.addPlayer("4", "player4");
    risk.init();

    assertEquals(risk.territoryState.size, 0);
  });

  it("should return a dummy player profile when player is not there in the players list", () => {
    const playerProfileData = [
      {
        colour: "red",
        avatar:
          "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
      },
      {
        colour: "yellow",
        avatar:
          "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
      },
    ];

    const risk = new Risk(3, () => "1", playerProfileData);
    risk.addPlayer("1", "player1");
    risk.addPlayer("2", "player2");
    risk.addPlayer("3", "player3");
    risk.init();

    assertEquals(risk.territoryState.size, 42);
  });

  it("should update the troops count in the territory", () => {
    const risk = new Risk(3, () => "1");

    risk.addPlayer("1", "player1");
    risk.addPlayer("2", "player2");
    risk.addPlayer("3", "player3");
    risk.init();

    risk.deployTroops("1", "india", 99);

    const india = risk.territoryState.get("india");

    assertEquals(india?.troops, 100);
  });

  it("should return undefined when invalid territory is requested", () => {
    const risk = new Risk(3, () => "1");

    risk.addPlayer("1", "player1");
    risk.addPlayer("2", "player2");
    risk.addPlayer("3", "player3");
    risk.init();

    risk.deployTroops("1", "invalid territory", 99);

    const actual = risk.territoryState.get("invalid territory");
    assertEquals(actual, undefined);
  });

  it("should respond with startGame in actions when deployment is over", () => {
    const risk = new Risk(3, () => "1");

    risk.addPlayer("1", "player1");
    risk.addPlayer("2", "player2");
    risk.addPlayer("3", "player3");
    risk.init();

    risk.deployTroops("1", "india", 105);

    const actual = risk.actions.at(-1);
    assertEquals(actual?.name, "startGame");
  });

  it("should respond with stopInitialDeployment in actions when deployment is over", () => {
    const risk = new Risk(3, () => "1");

    risk.addPlayer("1", "player1");
    risk.addPlayer("2", "player2");
    risk.addPlayer("3", "player3");
    risk.init();

    risk.deployTroops("1", "india", 105);

    const actual = risk.actions.at(-2);
    assertEquals(actual?.name, "stopInitialDeployment");
  });

  it("should respond with troopsDeployed in actions when deployment is not over", () => {
    const risk = new Risk(3, () => "1");

    risk.addPlayer("1", "player1");
    risk.addPlayer("2", "player2");
    risk.addPlayer("3", "player3");
    risk.init();

    risk.deployTroops("1", "india", 99);

    const actual = risk.actions.at(-1);
    assertEquals(actual?.name, "troopsDeployed");
  });

  it("should respond with troopsDeployed in actions when deployment is not over", () => {
    const risk = new Risk(3, () => "1");

    risk.addPlayer("1", "player1");
    risk.addPlayer("2", "player2");
    risk.addPlayer("3", "player3");
    risk.init();

    const actual = risk.actions.at(-1);
    assertEquals(actual?.name, "intialDeploymentStart");
  });
});
