import { Hono } from "hono";
import Server, { ContextBean } from "./server.ts";

import { AuthService } from "./services/authService.ts";

const getContextBeans = (): ContextBean[] => {
  return [new AuthService()];
};

const main = () => {
  const app = new Hono();
  const server = new Server(app, getContextBeans());

  Deno.serve({ port: 3000 }, server.initialize());
};

main();