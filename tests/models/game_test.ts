import { assertEquals } from "assert";
import { describe, it } from "testing";
import Game from "../../src/models/game.ts";
import { GameStatus } from "../../src/types/game.ts";

describe("tests for game model", () => {
  it("should add player to the game", () => {
    const game = new Game(2);
    game.addPlayer("12", "john");

    const expected = {
      "12": {
        avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
        colour: "red",
        name: "john",
      },
    };
    assertEquals(game.state.players, expected);
  });

  it("should start the game when looby is full", () => {
    const game = new Game(2);
    game.addPlayer("1", "doe");
    game.addPlayer("12", "john");
    const expected = {
      "1": {
        avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
        colour: "red",
        name: "doe",
      },
      "12": {
        avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
        colour: "yellow",
        name: "john",
      },
    };

    assertEquals(game.state.players, expected);
    assertEquals(game.status, GameStatus.running);
  });
});
