import { Context } from "hono";
import Users from "../models/users.ts";
import GameManager from "../models/gameManager.ts";

const boardDataHandler = (ctx: Context) => {
  const gameManager: GameManager = ctx.get("gameManager");
  const userId: string = ctx.get("userId");
  const gameDetails = gameManager.getPlayerGameDetails(userId);

  return ctx.json(gameDetails);
};

const joinGameHandler = (context: Context) => {
  const userId: string = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");
  const users: Users = context.get("users");

  const username: string | undefined = users.findById(userId);
  gameManager.allotPlayer(6, userId, username);

  return context.redirect("/game");
};

const updateTroops = async (context: Context) => {
  const userId = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");
  const game = gameManager.playerActiveGame(userId);
  const { territory, troops } = await context.req.json();
  game?.state.updateTroops(territory, troops);

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


export {
  boardDataHandler,
  joinGameHandler,
  fetchPlayerInfo,
  updateTroops
};
