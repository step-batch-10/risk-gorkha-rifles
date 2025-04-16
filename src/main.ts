import Session from "./models/session.ts";
import Users from "./models/users.ts";
import Server from './server.ts';

const uniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36);
};

const main = () => {
  const session = new Session(uniqueId);
  const users = new Users(uniqueId);

  const server = new Server(users, session, uniqueId);
  server.start();
};

main();
