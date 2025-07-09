import { describe, it } from "testing";
import { assertEquals } from "assert";
import { Hono } from "hono";
import Server from "../src/server.ts";
import { SessionRepository } from "../src/repository/sessionRepository.ts";


const createServer = () => {
  const app = new Hono();
  const sessionRepository = new SessionRepository(() => "1");
  sessionRepository.createSession("2");

  const server = new Server(app, [sessionRepository]);
  server.initialize();

  return app;
};

describe('Sessions Tests | Server', () => {
  it('should reuturn 401 for api routes if sessionId not present', async () => {
    const server = createServer();
    const response = await server.request("/api/anything", {
      method: "GET"
    });

    assertEquals(401, response.status);
  });

  it('should reuturn 401 for api routes if sessionId is invalid', async () => {
    const server = createServer();
    const response = await server.request("/api/anything", {
      method: "GET",
      headers: {
        Cookie: "sessionId=2"
      }
    });

    assertEquals(401, response.status);
  });
});
