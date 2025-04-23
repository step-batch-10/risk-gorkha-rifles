import { Context } from "hono";
import Users, { User } from "../models/users.ts";
import GameManager from "../models/gameManager.ts";
import { AllotStatus } from "../types/game.ts";

const gameActionsHandler = (context: Context) => {
  const lastActionAt = Number(context.req.query("since"));
  const gameManager: GameManager = context.get("gameManager");
  const userId: string = context.get("userId");
  const gameActions = gameManager.getGameActions(userId, lastActionAt);

  console.log(gameActions);

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

const profileDetailsHandler = (context: Context) => {
  const userId: string = context.get("userId");
  const users: Users = context.get("users");
  const userDetails: User = users.findById(userId);

  return context.json(userDetails);
};

const fullProfileDetailsHandler = (context: Context) => {
  const userId: string = context.get("userId");
  const users: Users = context.get("users");
  const { username, avatar }: User = users.findById(userId);

  return context.json({
    username,
    avatar,
    matchesPlayed: 0,
    matchesWon: 0,
  });
};

export {
  joinGameHandler,
  gameActionsHandler,
  lobbyStatusHandler,
  profileDetailsHandler,
  fullProfileDetailsHandler,
};
