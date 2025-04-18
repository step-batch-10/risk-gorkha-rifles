import { assertEquals } from "assert";
import { describe, it } from "jsr:@std/testing/bdd";
import Risk from "../../src/models/risk.ts";

describe("tests for risk model", () => {
  it("should initialize the territoryState data member", () => {
    const risk = new Risk();
    risk.addPlayer("1", "player1");
    risk.addPlayer("2", "player2");
    risk.addPlayer("3", "player3");
    risk.addPlayer("4", "player4");
    risk.addPlayer("5", "player5");
    risk.addPlayer("6", "player6");
    risk.init();

    assertEquals(risk.territoryState.size, 42);
  });

  it("should not initialize risk instance if not 6 players joined", () => {
    const risk = new Risk();
    risk.addPlayer("1", "player1");
    risk.addPlayer("2", "player2");
    risk.addPlayer("3", "player3");
    risk.addPlayer("4", "player4");
    risk.init();

    assertEquals(risk.territoryState.size, 0);
  });

  it("should return a dummy player profile when player is not there in the players list", () => {
    const playerProfileData = [
      { colour: "red", avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740" },
      { colour: "yellow", avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740" },
      { colour: "blue", avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740" },
      { colour: "violet", avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740" },
      { colour: "orange", avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740" },
    ];

    const risk = new Risk(playerProfileData);
    risk.addPlayer("1", "player1");
    risk.addPlayer("2", "player2");
    risk.addPlayer("3", "player3");
    risk.addPlayer("4", "player4");
    risk.addPlayer("5", "player5");
    risk.addPlayer("6", "player6");
    risk.init();

    assertEquals(risk.territoryState.size, 42);
  });

  it("should update the troops count in the territory", () => {
    const risk = new Risk();

    risk.addPlayer("1", "player1");
    risk.addPlayer("2", "player2");
    risk.addPlayer("3", "player3");
    risk.addPlayer("4", "player4");
    risk.addPlayer("5", "player5");
    risk.addPlayer("6", "player6");
    risk.init();

    risk.deployTroops("india", 99);

    const india = risk.territoryState.get("india");

    assertEquals(india?.troops, 100);
  });
});
