import { assertEquals } from "assert";
import { describe, it } from "testing";
import Game from "../src/models/game.ts";
import { GameStatus } from "../src/types/game.ts";

describe("tests for game model", () => {
  it("should add player to the game", () => {
    const game = new Game(2);
    game.addPlayer("12", "john");

    assertEquals(game.state.players, { "12": "john" });
  });

  it("should start the game when looby is full", () => {
    const game = new Game(2);
    game.addPlayer("12", "john");
    game.addPlayer("1", "doe");

    assertEquals(game.state.players, { "12": "john", "1": "doe" });
    assertEquals(game.status, GameStatus.running);
  });
});