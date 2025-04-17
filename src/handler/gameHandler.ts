import { Context } from "hono";
import GameManager from "../models/gameManager.ts";

const boardDataHandler = (ctx: Context) => {
  const gameManager: GameManager = ctx.get("gameManager");
  const userId: string = ctx.get("userId");
  const game = gameManager.playerActiveGame(userId);
  console.log("-".repeat(40));
  console.log(game);

  console.log("-".repeat(40));

  return ctx.json(game);
};

export { boardDataHandler };
