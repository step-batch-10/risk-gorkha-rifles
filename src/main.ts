import { Hono } from "hono";
import Server, { ContextBean } from "./server.ts";

import { AuthService } from "./service/authService.ts";
import { UserRepository } from "./repository/userRepository.ts";
import { SessionRepository } from "./repository/sessionRepository.ts";
import LobbyService from "./service/lobbyService.ts";
import GameService from "./service/gameService.ts";

const uniqueIdGenerator = () => crypto.randomUUID();

const getContextBeans = (): ContextBean[] => {
  const userRepository = new UserRepository(uniqueIdGenerator);
  const sessionRepository = new SessionRepository(uniqueIdGenerator);
  const authService = new AuthService(userRepository, sessionRepository);

  const gameService = new GameService();
  const lobbyService = new LobbyService(gameService);

  return [authService, lobbyService, sessionRepository];
};

const main = () => {
  const app = new Hono();
  const server = new Server(app, getContextBeans());

  Deno.serve({ port: 3000 }, server.initialize());
};

main();