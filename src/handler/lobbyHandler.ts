import { Context } from "hono";
import LobbyService from "../service/lobbyService.ts";
import { ValidationError } from "../service/authService.ts";
import { BEAN } from "../constant/Bean.ts";

export const joinLobbyHandler = async (context: Context) => {
  try {
    const { noOfPlayers } = await context.req.json();
    const userId = context.get("userId");
    const lobbyService: LobbyService = context.get(BEAN.lobbyService);

    if (!noOfPlayers) {
      return context.json({ error: "Invalid request data" }, 400);
    }

    lobbyService.joinLobby(noOfPlayers, userId);
    return context.json(null, 200);
  } catch (error) {
    if (error instanceof ValidationError)
      return context.json({ error: error.message }, 400);

    return context.json(null, 500);
  }
};