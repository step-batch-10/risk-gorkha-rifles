import { assertEquals } from 'assert';
import { describe, it } from 'jsr:@std/testing/bdd';
import Server from '../src/server.ts';
import { Hono } from 'hono';

describe('Server', () => {
  it('should initialize with an instance of Hono', () => {
    const server = new Server();
    assertEquals(server.app instanceof Hono, true);
  });

  it('should call appMethod during initialization', () => {
    const server = new Server();
    assertEquals(server.app.routes.length > 0, true);
  });

  it('should return the text', async () => {
    const server = new Server();
    const response = await server.app.request('/test');

    assertEquals(await response.text(), 'connected');
  });
});
