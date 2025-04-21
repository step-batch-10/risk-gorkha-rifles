import { Context } from "hono";
import Users from "../models/users.ts";
import GameManager from "../models/gameManager.ts";

const gameActionsHandler = (context: Context) => {
  const lastActionat = Number(context.req.query("since"));
  const gameManager: GameManager = context.get("gameManager");
  const userId: string = context.get("userId");
  const gameActions = gameManager.getGameActions(userId, lastActionat);

  return context.json(gameActions);
};

const reinforcementRequestHandler = (context: Context) => {
  const gameManager: GameManager = context.get("gameManager");
  const userId: string = context.get("userId");
  const game = gameManager.playerActiveGame(userId);

  if (!game) {
    return context.json({ message: "Game not found" }, 400);
  }

  const troopsAvailable = gameManager.reinforcementDetails(game, userId);

  return context.json({ troopsAvailable });
};

const joinGameHandler = (context: Context) => {
  const userId: string = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");
  const users: Users = context.get("users");

  const username: string | undefined = users.findById(userId);
  gameManager.allotPlayer(3, userId, username);

  return context.redirect("/game");
};

const updateTroops = async (context: Context) => {
  const userId = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");
  const game = gameManager.playerActiveGame(userId);
  const { territory, troops } = await context.req.json();

  if (!game) return context.json({ message: "Game not found" }, 400);

  gameManager.updateTroops(game, userId, territory, troops);

  return context.json({ message: "successfully updated troops" });
};

const fetchPlayerInfo = (ctx: Context) => {
  const userId: string = ctx.get("userId");
  const users: Users = ctx.get("users");
  const username: string | undefined = users.findById(userId);

  return ctx.json({
    playerName: username,
    avatar:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
  });
};

const fetchFullPlayerInfo = (ctx: Context) => {
  const userId: string = ctx.get("userId");
  const users: Users = ctx.get("users");
  const username: string | undefined = users.findById(userId);

  return ctx.json({
    playerName: username,
    avatar:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
    matchesPlayed: 0,
    matchesWon: 0,
  });
};

export {
  joinGameHandler,
  fetchPlayerInfo,
  updateTroops,
  fetchFullPlayerInfo,
  gameActionsHandler,
  reinforcementRequestHandler,
};
