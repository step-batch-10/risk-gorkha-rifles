import { Context } from "hono";
import Users from "../models/users.ts";
import GameManager from "../models/gameManager.ts";
import { AllotStatus } from "../types/game.ts";

const gameActionsHandler = (context: Context) => {
  const lastActionAt = Number(context.req.query("since"));
  const gameManager: GameManager = context.get("gameManager");
  const userId: string = context.get("userId");
  const gameActions = gameManager.getGameActions(userId, lastActionAt);

  return context.json(gameActions);
};

const joinGameHandler = (context: Context) => {
  const userId: string = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");
  gameManager.allotPlayer(userId, "3");

  return context.redirect("/game/waiting.html");
};

const lobbyStatusHandler = (context: Context) => {
  const gameManager: GameManager = context.get("gameManager");
  const userId: string = context.get("userId");
  const users: Users = context.get("users");
  const lobbyStatus = gameManager.waitingStatus(userId);

  if (lobbyStatus.status) {
    return context.json({
      status: AllotStatus.waitingLobby,
      players: userProfileBuilder(users, lobbyStatus.players),
    });
  }

  return context.json({ status: AllotStatus.gameRoom, players: [] });
};

const userProfileBuilder = (users: Users, players: string[]) => {
  return players.map((playerId) => users.findById(playerId));
};

export { joinGameHandler, gameActionsHandler, lobbyStatusHandler };
