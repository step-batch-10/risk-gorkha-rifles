import { assertEquals } from "assert";
import { describe, it } from "testing";
import Server from "../../src/server.ts";
import { Hono } from "hono";
import { AuthService } from "../../src/services/authService.ts";

const createServer = () => {
  const app = new Hono();
  const server = new Server(app, [new AuthService()]);
  server.initialize();

  return app;
};

describe('Login handler test - Auth Handler', () => {
  it('should return 400 if username is not provided', async () => {
    const server = createServer();

    const response = await server.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar: "avatar.png" })
    });

    const result = await response.json();
    assertEquals(response.status, 400);
    assertEquals(result.message, "Username must be filled out");
  });
});