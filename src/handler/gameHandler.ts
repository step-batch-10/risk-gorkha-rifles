import { Context } from "hono";
import Users, { User } from "../models/users.ts";
import GameManager from "../models/gameManager.ts";
import {
  ActionTypes,
  AllotStatus,
  LobbyStatus,
  CardType,
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

const requestReinforcementHandler = (context: Context) => {
  const userId: string = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");

  const action: ActionDetails = {
    name: ActionTypes.reinforceRequest,
    playerId: userId,
    data: {},
  };

  const reinforcementData = gameManager.handleGameActions(action);
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

const deploymentStatusHandler = (context: Context) => {
  const userId: string = context.get("userId");
  const gameManager: GameManager = context.get("gameManager");
  const status = gameManager.handleGameActions({
    playerId: userId,
    name: "isDeploymentOver",
    data: {},
  });

  return context.json({ status });
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
    { infantry: 0, cavalry: 0, artillery: 0, hybrid: 0 }
  );
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
  deploymentStatusHandler,
  cardsHandler,
  defendingTerritories,
  getDefendingPlayer,
};
