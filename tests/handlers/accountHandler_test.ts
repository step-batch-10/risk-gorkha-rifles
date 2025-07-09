import { Hono } from "hono";
import { assertEquals } from "assert";
import { describe, it } from "testing";

import Server, { ContextBean } from "../../src/server.ts";
import { AuthService } from "../../src/service/authService.ts";
import { SessionRepository } from "../../src/repository/sessionRepository.ts";
import { UserRepository } from "../../src/repository/userRepository.ts";
import AccountService from "../../src/service/accountService.ts";

const mockedBeans = (): Record<string, ContextBean> => {
  const sessionRepository = new SessionRepository(() => "1");
  const userRepository = new UserRepository(() => "1");

  userRepository.createUser("test", "test_url");

  const accountService = new AccountService(userRepository);
  const authService = new AuthService(userRepository, sessionRepository);

  return { accountService, authService, sessionRepository };
};

const createServer = () => {
  const app = new Hono();
  const contextBeans: Record<string, ContextBean> = mockedBeans();

  const server = new Server(app, Object.values(contextBeans));
  server.initialize();

  return { app, ...contextBeans };
};

describe('Login handler test - Auth Handler', () => {
  it('should return user profile details', async () => {
    const { app, sessionRepository }: any = createServer();
    sessionRepository.createSession("1");

    const response = await app.request("/api/profile", {
      headers: {
        "Content-Type": "application/json",
        "Cookie": "sessionId=1"
      },
    });

    const result = await response.json();

    assertEquals(response.status, 200);
    assertEquals(result.username, "test");
    assertEquals(result.avatar, "test_url");
  });

  it('should return 404 if user id is invalid', async () => {
    const { app, sessionRepository }: any = createServer();
    sessionRepository.createSession("2");

    const response = await app.request("/api/profile", {
      headers: {
        "Content-Type": "application/json",
        "Cookie": "sessionId=1"
      },
    });

    assertEquals(response.status, 404);
  });
});