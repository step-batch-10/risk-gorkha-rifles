import { assertEquals, assert } from "assert";
import { describe, it } from "testing";
import Game from "../../src/models/game.ts";
import { GameStatus } from "../../src/types/game.ts";
import GameManager from "../../src/models/gameManager.ts";
import Users from "../../src/models/users.ts";

describe("tests for gameManager model", () => {
  it("should create a new game", () => {
    const gameManager = new GameManager();
    const actual = gameManager.createGame();
    const expected = new Game();

    assertEquals(JSON.stringify(actual), JSON.stringify(expected));
  });

  it("should add player to game to new game", () => {
    const gameManager = new GameManager();
    const newGame = gameManager.createGame();
    newGame.status = GameStatus.running;

    const game = gameManager.allotPlayer(3, "123", "player1");

    const expected = {
      "123": {
        avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
        colour: "red",
        name: "player1",
      },
    };

    assertEquals(game.state.players, expected);
  });

  it("should add player to game to existing waiting game", () => {
    const gameManager = new GameManager();
    gameManager.createGame();

    const game = gameManager.allotPlayer(6, "123", "player1");

    const expected = {
      "123": {
        avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
        colour: "red",
        name: "player1",
      },
    };

    assertEquals(game.state.players, expected);
  });

  it("should find the player active game (waiting)", () => {
    const gameManager = new GameManager();
    gameManager.allotPlayer(3, "123", "player1");

    const activeGame = gameManager.playerActiveGame("123");
    const game = new Game();
    game.addPlayer("123", "player1");

    assert(activeGame instanceof Game);
    assertEquals(JSON.stringify(activeGame), JSON.stringify(game));
  });

  it("should find the player active game (running)", () => {
    const gameManager = new GameManager();
    gameManager.allotPlayer(3, "129", "player7");
    gameManager.allotPlayer(3, "130", "player8");
    gameManager.allotPlayer(3, "131", "player9");

    const activeGame = gameManager.playerActiveGame("130");

    assert(activeGame instanceof Game);
  });

  it("should find the player active game (running)", () => {
    const generatorId = () => {
      let i = 0;
      return () => (i++).toString();
    };

    
    const gameManager = new GameManager(generatorId());
    gameManager.allotPlayer(3, "129", "player7");
    gameManager.allotPlayer(3, "130", "player8");
    gameManager.allotPlayer(3, "131", "player9");

    gameManager.allotPlayer(4, "132", "player8");
    gameManager.allotPlayer(5, "133", "player9");
    gameManager.allotPlayer(6, "134", "player10");

    const activeGame = gameManager.playerActiveGame("129");

    assert(activeGame instanceof Game);
  });

  it("should return null for no active game", () => {
    const gameManager = new GameManager();

    const activeGame = gameManager.playerActiveGame("123");
    assertEquals(activeGame, null);
  });

  it("should not allot new game to player already in a active game", () => {
    const users: Users = new Users();
    const playerId = users.createUser("john");
    const gameManager = new GameManager();
    const expected = gameManager.allotPlayer(3, playerId, "john");
    const actual = gameManager.allotPlayer(3, "1", "john");

    assertEquals(expected, actual);
  });
});
