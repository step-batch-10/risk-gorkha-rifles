import GameManager from "./models/gameManager.ts";
import Session from "./models/session.ts";
import Users from "./models/users.ts";
import Server from "./server.ts";

export const uniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36);
};

const main = () => {
  const session = new Session(uniqueId);
  const users = new Users(uniqueId);
  const gameManager = new GameManager(uniqueId);

  const server = new Server(users, session, gameManager, uniqueId);
  Deno.serve({ port: 3000 }, server.app.fetch);
};

main();
