import GameManager from "../src/models/gameManager.ts";
import Session from "../src/models/session.ts";
import Users from "../src/models/users.ts";
import Server from "../src/server.ts";
import {
  getContinents,
  neighbouringTerritories,
} from "../src/utils/continents.ts";
import lodash from "npm:lodash";

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

  const gameManager = new GameManager(
    uniqueId,
    getContinents,
    Date.now,
    lodash.shuffle,
    neighbouringTerritories()
  );
  gameManager.allotPlayer(user1Id, "3");
  gameManager.allotPlayer(user2Id, "3");

  const id = setInterval(() => {
    const game = gameManager.findPlayerActiveGame(user1Id);

    if (game) {
      const territory1 = game?.playerTerritories(user1Id).at(1) || "";
      const territory2 = game?.playerTerritories(user2Id).at(1) || "";

      gameManager.handleGameActions({
        playerId: user1Id,
        name: "updateTroops",
        data: { territory: territory1, troopCount: 21 },
      });

      gameManager.handleGameActions({
        playerId: user2Id,
        name: "updateTroops",
        data: { territory: territory2, troopCount: 21 },
      });
      clearInterval(id);
    }
  }, 2000);

  const server = new Server(users, session, gameManager, uniqueId);
  Deno.serve({ port: 3000 }, server.serve());
};

main();
