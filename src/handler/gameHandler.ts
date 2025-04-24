import { Context } from "hono";
import Users, { User } from "../models/users.ts";
import GameManager from "../models/gameManager.ts";
import { AllotStatus, LobbyStatus } from "../types/gameTypes.ts";

const gameActionsHandler = (context: Context) => {
  const lastActionAt = Number(context.req.query("since"));
  const gameManager: GameManager = context.get("gameManager");
  const userId: string = context.get("userId");
  const gameActions = gameManager.getGameActions(userId, lastActionAt);
  const users = context.get("users");

  return context.json({
    status: gameActions.status,
    currentPlayer: gameActions.currentPlayer,
    actions: gameActions.actions,
    players: userProfileBuilder(users, gameActions.players),
  });
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

  return context.json(formatLobbyStatusHandlerResponse(lobbyStatus, users));
};

const formatLobbyStatusHandlerResponse = (
  lobbyStatus: LobbyStatus,
  users: Users
) => {
  if (lobbyStatus.status) {
    return {
      status: AllotStatus.waitingLobby,
      players: userProfileBuilder(users, lobbyStatus.players),
    };
  }

  return { status: AllotStatus.gameRoom, players: [] };
};

const userProfileBuilder = (users: Users, players: string[] = []) => {
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
