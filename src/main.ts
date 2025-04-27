import GameManager from "./models/gameManager.ts";
import Session from "./models/session.ts";
import Users from "./models/users.ts";
import Server from "./server.ts";
import { Continent } from "./types/gameTypes.ts";
import lodash from "npm:lodash";
import { getContinents, neighbouringTerritories } from "./utils/continents.ts";
import Messages from "./models/messages.ts";

export const uniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36);
};

const main = () => {
  const session = new Session(uniqueId);
  const users = new Users(uniqueId);
  const connectedTerritories: Continent = neighbouringTerritories();
  const messages = new Messages(Date.now, uniqueId);
  const gameManager = new GameManager(
    uniqueId,
    getContinents,
    Date.now,
    lodash.shuffle,
    connectedTerritories,
    messages
  );

  const server = new Server(users, session, gameManager, uniqueId);
  Deno.serve({ port: 3000 }, server.serve());
};

main();
