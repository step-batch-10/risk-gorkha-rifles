import GameManager from "../src/models/gameManager.ts";
import Session from "../src/models/session.ts";
import Users from "../src/models/users.ts";
import Server from "../src/server.ts";
import { getContinents } from "../src/utils/continents.ts";

export const uniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36);
};

export const main = () => {
  const session = new Session(uniqueId);
  const users = new Users(uniqueId);

  users.createUser(
    "dummyPlayer1",
    "https://img.etimg.com/thumb/width-420,height-315,imgsize-226717,resizemode-75,msid-107974226/news/international/us/netflixs-avatar-the-last-airbender-season-2-all-you-may-want-to-know-about-renewal-status-what-to-expect-and-more.jpg"
  );

  users.createUser(
    "dummyPlayer2",
    "https://img.freepik.com/premium-vector/man-professional-business-casual-young-avatar-icon-illustration_1277826-622.jpg?semt=ais_hybrid&w=740"
  );

  const user1Id = users.findIdByUsername("dummyPlayer1") || "";
  const user2Id = users.findIdByUsername("dummyPlayer2") || "";

  console.log(user1Id, user2Id);
  const gameManager = new GameManager(uniqueId, getContinents, Date.now);
  gameManager.allotPlayer(user1Id, "3");
  gameManager.allotPlayer(user2Id, "3");

  const server = new Server(users, session, gameManager, uniqueId);
  Deno.serve({ port: 3000 }, server.serve());
};

main();
