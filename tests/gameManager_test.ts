import { assertEquals, assert } from 'assert';
import { describe, it } from 'testing';
import Game from '../src/models/game.ts';
import { GameStatus } from '../src/types/game.ts';
import GameManager from '../src/models/gameManager.ts';

describe('tests for gameManager model', () => {
  it('should create a new game', () => {
    const gameManager = new GameManager();
    const actual = gameManager.createGame();
    const expected = new Game();

    assertEquals(actual, expected);
    assertEquals(gameManager.games.length, 1);
  });

  it('should add player to game to new game', () => {
    const gameManager = new GameManager();
    const newGame = gameManager.createGame();
    newGame.status = GameStatus.running;

    const game = gameManager.allotPlayer(6, '123', 'player1');

    const expected = new Map();
    expected.set('123', 'player1');

    assertEquals(game.state.players, expected);
    assertEquals(gameManager.games.length, 2);
  });

  it('should add player to game to existing waiting game', () => {
    const gameManager = new GameManager();
    gameManager.createGame();

    const game = gameManager.allotPlayer(6, '123', 'player1');

    const expected = new Map();
    expected.set('123', 'player1');

    assertEquals(game.state.players, expected);
    assertEquals(gameManager.games.length, 1);
  });

  it('should find the player active game', () => {
    const gameManager = new GameManager();
    gameManager.allotPlayer(6, '123', 'player1');

    const activeGame = gameManager.playerActiveGame('123');
    const game = new Game();
    game.addPlayer('123', 'player1');

    assert(activeGame instanceof Game);
    assertEquals(activeGame, game);
  });
});
