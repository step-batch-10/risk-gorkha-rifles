import { assert } from 'assert';
import { describe, it } from 'jsr:@std/testing/bdd';
import Server from '../src/server.ts';
import { Hono } from 'hono';
import Users from '../src/models/users.ts';
import Session from '../src/models/session.ts';
import GameManager from '../src/models/gameManager.ts';

describe('Server', () => {
  it('should initialize with an instance of Hono', () => {
    const users = new Users();
    const session = new Session();
    const gameManager = new GameManager();
    const server = new Server(users, session, gameManager, () => '1');
    assert(server.app instanceof Hono);
  });
});
