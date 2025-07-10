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
  it('should return 401 for api routes if sessionId not present', async () => {
    const server = createServer();
    const response = await server.request("/api/anything", {
      method: "GET"
    });

    assertEquals(401, response.status);
  });

  it('should return 401 for api routes if sessionId is invalid', async () => {
    const server = createServer();
    const response = await server.request("/api/anything", {
      method: "GET",
      headers: {
        Cookie: "sessionId=2"
      }
    });

    assertEquals(401, response.status);
  });

  it('should redirect to login if unauth user tried visiting protected route (/)', async () => {
    const server = createServer();
    const response = await server.request("/", {
      method: "GET"
    });

    assertEquals(302, response.status);
    assertEquals("/login", response.headers.get("location"));
  });

  it('should redirect to login if unauth user tried visiting protected route (/game)', async () => {
    const server = createServer();
    const response = await server.request("/game", {
      method: "GET"
    });

    assertEquals(302, response.status);
    assertEquals("/login", response.headers.get("location"));
  });

  it('should redirect to login if unauth user tried visiting protected route (/game/anything)', async () => {
    const server = createServer();
    const response = await server.request("/game/anything", {
      method: "GET"
    });

    assertEquals(302, response.status);
    assertEquals("/login", response.headers.get("location"));
  });
});
