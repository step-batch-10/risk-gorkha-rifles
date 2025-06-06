import { Context } from "hono";
import Users, { User } from "../models/users.ts";
import GameManager from "../models/gameManager.ts";
import {
  ActionTypes,
  AllotStatus,
  LobbyStatus,
  CardType,
  FortificationDetails,
} from "../types/gameTypes.ts";
import { ActionDetails } from "../models/game.ts";

interface Player {
  id: string;
  colour: string;
  username?: string;
  avatar?: string;
}

const gameActionsHandler = (context: Context) => {
  const lastActionAt = Number(context.req.query("since"));
  const gameManager: GameManager = context.get("gameManager");
  const userId: string = context.get("userId");
  const gameActions = gameManager.getGameActions(userId, lastActionAt);
  const users = context.get("users");

  return context.json({
    status: gameActions.status,
    userId: gameActions.userId,
    actions: gameActions.actions,
    players: gameProfileBuilder(users, gameActions.players),
  });
};

const requestAttackHandler = (context: Context) => {
  const userId: string = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");

  const action: ActionDetails = {
    name: ActionTypes.requestAttack,
    playerId: userId,
    data: {},
  };

  const attackingTerritories = gameManager.handleGameActions(action);
  return context.json({ attackingTerritories });
};

const requestReinforcementHandler = async (context: Context) => {
  const userId: string = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");
  const { cards } = await context.req.json();

  const action: ActionDetails = {
    name: ActionTypes.reinforceRequest,
    playerId: userId,
    data: { cards },
  };

  const reinforcementData = gameManager.handleGameActions(action);
  console.log("reinfocement data", reinforcementData);
  return context.json(reinforcementData);
};

const defendingTerritories = async (context: Context) => {
  const body = await context.req.json();
  const userId: string = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");

  const action: ActionDetails = {
    name: ActionTypes.requestNeighbouringTerritories,
    playerId: userId,
    data: {
      territoryId: body.attackingTerritoryId,
    },
  };
  const defendingTerritories = gameManager.handleGameActions(action);
  return context.json({ defendingTerritories });
};

const getDefendingPlayer = async (context: Context) => {
  const body = await context.req.json();
  const userId: string = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");

  const action: ActionDetails = {
    name: ActionTypes.requestDefendingPlayer,
    playerId: userId,
    data: {
      territoryId: body.defendingTerritory,
    },
  };

  const defendingPlayer = gameManager.handleGameActions(action);

  return context.json({ defendingPlayer });
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

const gameProfileBuilder = (users: Users, players: Player[] = []): Player[] => {
  return players.map((player) => {
    const { username, avatar } = users.findById(player.id);
    return {
      id: player.id,
      colour: player.colour,
      username,
      avatar,
    };
  });
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

const updateTroopsHandler = async (context: Context) => {
  const userId: string = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");
  const { territory, troopCount } = await context.req.json();

  const updatedTroops = gameManager.handleGameActions({
    playerId: userId,
    name: "updateTroops",
    data: { territory, troopCount },
  });

  return context.json(updatedTroops);
};

const startGameHandler = (context: Context) => {
  const userId: string = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");
  const status = gameManager.handleGameActions({
    playerId: userId,
    name: "startGame",
    data: {},
  });

  return context.json(status);
};

const cardsHandler = (context: Context) => {
  const userId: string = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");
  const action: ActionDetails = {
    playerId: userId,
    name: "getCards",
    data: {},
  };
  const cards = gameManager.handleGameActions(action);

  return context.json(getTypeCounts(cards));
};

export const getTypeCounts = (cards: CardType[]): Record<CardType, number> => {
  return cards.reduce(
    (acc, type) => {
      acc[type]++;
      return acc;
    },
    { infantry: 0, cavalry: 0, artillery: 0, wild: 0 }
  );
};

const storeTroops = async (context: Context) => {
  const userId: string = context.get("userId");
  const { troops } = await context.req.json();

  const gameManager: GameManager = context.get("gameManager");
  const status = gameManager.handleGameActions({
    playerId: userId,
    name: "storeTroops",
    data: {
      troops,
    },
  });

  return context.json(status);
};

export const fortificationHandler = async (context: Context) => {
  const fortificationDetails: FortificationDetails = await context.req.json();
  const userId: string = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");

  const actionDetails: ActionDetails = {
    name: "fortification",
    playerId: userId,
    data: fortificationDetails,
  };

  const fortificationResponse = await gameManager.handleGameActions(
    actionDetails
  );

  return context.json(fortificationResponse);
};

export const connectedTerritoriesHandler = (context: Context) => {
  const territoryId: string = context.req.query("territoryId") || "";

  if (!territoryId)
    return context.json({ message: "Territory Id not given" }, 400);

  const userId: string = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");
  const action: ActionDetails = {
    playerId: userId,
    name: "connectedTerritories",
    data: { territoryId },
  };

  const connectedTerritories = gameManager.handleGameActions(action);
  return context.json(connectedTerritories);
};

export const startFortification = (context: Context) => {
  const userId: string = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");

  const action: ActionDetails = {
    name: "startFortification",
    data: {},
    playerId: userId,
  };
  gameManager.handleGameActions(action);

  return context.json({ actionStatus: true });
};

export const saveMessage = async (context: Context) => {
  const userId: string = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");
  const { message, recipientId } = await context.req.json();

  if (!message)
    return context.json(
      { messageStatus: false, error: "Message content is required" },
      400
    );

  gameManager.saveMessage(userId, message, recipientId);

  return context.json({
    messageStatus: true,
  });
};

export const getMessages = (context: Context) => {
  const since: number = Number(context.req.query("since")) || 0;

  const userId: string = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");

  const gameMessages = gameManager.getMessages(userId, since);
  const personalMessages = gameManager.getPersonalMessages(userId, since);

  return context.json({
    gameMessages,
    personalMessages,
  });
};

export const getGamePlayers = (context: Context) => {
  const users: Users = context.get("users");
  const userId: string = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");
  const action: ActionDetails = {
    playerId: userId,
    data: {},
    name: "getGamePlayers",
  };

  const gamePlayers: string[] = gameManager.handleGameActions(action);
  const playersDetails = gamePlayers.map((playerId) => {
    return {
      ...users.findById(playerId),
      userId: playerId,
    };
  });

  return context.json(playersDetails);
};

export {
  joinGameHandler,
  gameActionsHandler,
  lobbyStatusHandler,
  profileDetailsHandler,
  fullProfileDetailsHandler,
  requestReinforcementHandler,
  updateTroopsHandler,
  requestAttackHandler,
  startGameHandler,
  cardsHandler,
  defendingTerritories,
  getDefendingPlayer,
  storeTroops,
};
