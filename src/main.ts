import { Hono } from "hono";
import lodash from "npm:lodash";
import Server, { ContextBean } from "./server.ts";

import LobbyService from "./service/lobbyService.ts";
import { AuthService } from "./service/authService.ts";
import AccountService from "./service/accountService.ts";
import { getContinents } from "./constant/continents.ts";
import { RiskFactoryConfig, RiskGame } from "./core/risk.ts";
import { UserRepository } from "./repository/userRepository.ts";
import { SessionRepository } from "./repository/sessionRepository.ts";
import GameService, { GameServiceConfig } from "./service/gameService.ts";

export type IdGenerator = () => string;
const uniqueIdGenerator: IdGenerator = () => crypto.randomUUID();

const createGameService = () => {
  const riskFactoryConfig: RiskFactoryConfig = {
    getContinents,
    shuffler: lodash.shuffle
  };

  const config: GameServiceConfig = {
    createGame: RiskGame.createFactory(riskFactoryConfig),
    idGenerator: uniqueIdGenerator
  };

  return new GameService(config);
};

const getContextBeans = (): ContextBean[] => {
  const userRepository = new UserRepository(uniqueIdGenerator);
  const sessionRepository = new SessionRepository(uniqueIdGenerator);

  const gameService = createGameService();
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