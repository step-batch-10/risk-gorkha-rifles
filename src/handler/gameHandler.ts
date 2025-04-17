import { Context } from "hono";
import Users from "../models/users.ts";
import GameManager from "../models/gameManager.ts";

const boardDataHandler = (ctx: Context) => {
  const gameManager: GameManager = ctx.get("gameManager");
  const userId: string = ctx.get("userId");
  const game = gameManager.playerActiveGame(userId);

  return ctx.json(game);
};

const joinGameHandler = (context: Context) => {
  const userId: string = context.get('userId');
  const gameManager: GameManager = context.get('gameManager');
  const users: Users = context.get('users');

  const username: string | undefined = users.findById(userId);
  gameManager.allotPlayer(6, userId, username);

  return context.redirect("/game");
};

export { boardDataHandler, joinGameHandler };
