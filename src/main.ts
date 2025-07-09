import { Hono } from "hono";
import Server, { ContextBean } from "./server.ts";

import GameService from "./service/gameService.ts";
import LobbyService from "./service/lobbyService.ts";
import { AuthService } from "./service/authService.ts";
import AccountService from "./service/accountService.ts";
import { UserRepository } from "./repository/userRepository.ts";
import { SessionRepository } from "./repository/sessionRepository.ts";

const uniqueIdGenerator = () => crypto.randomUUID();

const getContextBeans = (): ContextBean[] => {
  const userRepository = new UserRepository(uniqueIdGenerator);
  const sessionRepository = new SessionRepository(uniqueIdGenerator);

  const gameService = new GameService();
  const lobbyService = new LobbyService(gameService);
  const accountService = new AccountService(userRepository);
  const authService = new AuthService(userRepository, sessionRepository);

  return [authService, lobbyService, sessionRepository, accountService];
};

const main = () => {
  const app = new Hono();
  const server = new Server(app, getContextBeans());

  Deno.serve({ port: 3000 }, server.initialize());
};

main();