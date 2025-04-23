import { Context } from "hono";
import Users from "../models/users.ts";
import GameManager from "../models/gameManager.ts";
const gameActionsHandler = (context: Context) => {
  const lastActionAt = Number(context.req.query("since"));
  const gameManager: GameManager = context.get("gameManager");
  const userId: string = context.get("userId");
  const gameActions = gameManager.getGameActions(userId, lastActionAt);

  return context.json(gameActions);
};

// const reinforcementRequestHandler = (context: Context) => {
//   const gameManager: GameManager = context.get("gameManager");
//   const userId: string = context.get("userId");
//   const game = gameManager.findPlayerActiveGame(userId);

//   if (!game) {
//     return context.json({ message: "Game not found" }, 400);
//   }

//   const troopsAvailable = gameManager.reinforcementDetails(game, userId);
//   console.log(troopsAvailable);
//   return context.json({ troopsAvailable });
// };

const joinGameHandler = (context: Context) => {
  const userId: string = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");
  // const users: Users = context.get("users");

  // const userDetails = users.findById(userId);
  gameManager.allotPlayer(userId, "3");

  return context.redirect("/game");
};

// const updateTroops = async (context: Context) => {
//   const userId = context.get("userId");
//   const gameManager: GameManager = context.get("gameManager");
//   const game = gameManager.findPlayerActiveGame(userId);
//   const { territory, troops } = await context.req.json();

//   if (!game) return context.json({ message: "Game not found" }, 400);

//   // gameManager.updateTroops(game, userId, territory, troops);

//   return context.json({ message: "successfully updated troops" });
// };

const fetchPlayerInfo = (ctx: Context) => {
  const userId: string = ctx.get("userId");
  const users: Users = ctx.get("users");
  const { avatar, userName } = users.findById(userId);

  return ctx.json({
    playerName: userName,
    avatar,
  });
};

const fetchFullPlayerInfo = (ctx: Context) => {
  const userId: string = ctx.get("userId");
  const users: Users = ctx.get("users");
  const { userName, avatar } = users.findById(userId);

  return ctx.json({
    playerName: userName,
    avatar,
    matchesPlayed: 0,
    matchesWon: 0,
  });
};

export {
  joinGameHandler,
  fetchPlayerInfo,
  fetchFullPlayerInfo,
  gameActionsHandler,
};
