import { Hono } from "hono";
import { assertEquals } from "assert";
import { describe, it } from "testing";

import Server from "../../src/server.ts";
import { AuthService } from "../../src/service/authService.ts";
import { HTTPErrorMessages } from "../../src/constant/messages.ts";
import { SessionRepository } from "../../src/repository/sessionRepository.ts";
import { UserRepository } from "../../src/repository/userRepository.ts";

const mockedAuthService = () => {
  const sessionRepository = new SessionRepository(() => "1");
  const userRepository = new UserRepository(() => "1");

  return new AuthService(userRepository, sessionRepository);
};

const createServer = () => {
  const app = new Hono();
  const server = new Server(app, [mockedAuthService()]);
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
    assertEquals(result.message, HTTPErrorMessages.USERNAME_AND_AVATAR_INVALID);
  });

  it('should return 400 if avatar is not provided', async () => {
    const server = createServer();

    const response = await server.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "valid_user" })
    });

    const result = await response.json();
    assertEquals(response.status, 400);
    assertEquals(result.message, HTTPErrorMessages.USERNAME_AND_AVATAR_INVALID);
  });

  it('should return 400 if username is invalid', async () => {
    const server = createServer();

    const response = await server.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "123invalid", avatar: "avatar.png" })
    });

    const result = await response.json();
    assertEquals(response.status, 400);
    assertEquals(result.message, HTTPErrorMessages.USERNAME_INVALID);
  });

  it('should return 302 and set cookies on successful login', async () => {
    const server = createServer();

    const response = await server.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "valid_user", avatar: "avatar.png" })
    });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get("set-cookie"), "sessionId=1; Path=/, userId=1; Path=/");
  });

  it('should create a new user and session on first login', async () => {
    const server = createServer();

    const response = await server.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "new_user", avatar: "new_avatar.png" })
    });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get("set-cookie"), "sessionId=1; Path=/, userId=1; Path=/");
  });

  it('should reuse existing user and create new session on subsequent login', async () => {
    const server = createServer();

    await server.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "existing_user", avatar: "existing_avatar.png" })
    });

    const response = await server.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "existing_user", avatar: "new_avatar.png" })
    });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get("set-cookie"), "sessionId=1; Path=/, userId=1; Path=/");
  });

  it('should return 500 if JSON parsing fails', async () => {
    const server = createServer();

    const response = await server.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: '{ "username": "broken_user"'
    });

    assertEquals(response.status, 500);
  });
});