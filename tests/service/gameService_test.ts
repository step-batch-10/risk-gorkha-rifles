import { describe, it } from "testing";

import { RiskGame } from "../../src/core/risk.ts";
import { mockContinents } from "../core/risk_test.ts";
import GameService from "../../src/service/gameService.ts";
import { IdGenerator } from "../../src/main.ts";
import { assertExists } from "assert/exists";
import { assertEquals } from "assert/equals";

export const createGameService = () => {
  const createGame = RiskGame.createFactory({
    getContinents: mockContinents,
    shuffler: (players: string[]) => [...players],
  });

  const createIdGenerator = (): IdGenerator => {
    let i = 1;
    return () => (i++).toString();
  };

  return new GameService({ createGame, idGenerator: createIdGenerator() });
};

describe("Game Service", () => {
  it("should create and store a game instance", () => {
    const gameService = createGameService();

    const players = ["1", "2", "3"];
    gameService.startGame(players);

    const game = gameService.getGameById("1");

    assertExists(game);

    const territoryState = game.territoryState();
    const territoryOwners = Object.values(territoryState).map(t => t.owner);
    for (const owner of territoryOwners) {
      assertExists(owner);
    }
  });

  it("should generate unique IDs for each game", () => {
    const gameService = createGameService();

    gameService.startGame(["a", "b"]);
    gameService.startGame(["c", "d"]);
    gameService.startGame(["e", "f"]);

    assertExists(gameService.getGameById("1"));
    assertExists(gameService.getGameById("2"));
    assertExists(gameService.getGameById("3"));
  });

  it("should return undefined if game does not exists", () => {
    const gameService = createGameService();

    gameService.startGame(["a", "b"]);

    assertEquals(undefined, gameService.getGameById("9"));
  });
});
