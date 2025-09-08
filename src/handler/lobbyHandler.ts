import { Context } from "hono";
import LobbyService from "../service/lobbyService.ts";
import { ValidationError } from "../service/authService.ts";
import { BEAN } from "../constant/Bean.ts";
import AccountService from "../service/accountService.ts";

export const joinLobbyHandler = async (context: Context) => {
  try {
    const { noOfPlayers } = await context.req.json();
    const userId = context.get("userId");
    const lobbyService: LobbyService = context.get(BEAN.lobbyService);

    if (!noOfPlayers) {
      return context.json({ error: "Invalid request data" }, 400);
    }

    lobbyService.joinLobby(noOfPlayers, userId);
    return context.redirect("waiting.html");
  } catch (error) {
    if (error instanceof ValidationError)
      return context.json({ error: error.message }, 400);

    return context.json(null, 500);
  }
};

export const lobbyStatusHandler = (context: Context) => {
  const userId: string = context.get("userId");
  const lobbyService: LobbyService = context.get(BEAN.lobbyService);
  const accountService: AccountService = context.get(BEAN.accountService);

  const players = lobbyService.getLobbyPlayers(userId);

  if (!players)
    return context.json({ status: false });

  const playerProfiles = accountService.buildProfiles(players);

  return context.json({ status: true, players: playerProfiles });
};