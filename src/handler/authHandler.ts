import { Context } from "hono";

import { setCookie } from "hono/cookie";
import { AuthService, ValidationError } from "../service/authService.ts";

export const loginHandler = async (context: Context) => {
  try {
    const { username, avatar } = await context.req.json();    
    const authService: AuthService = context.get("authService");

    const { sessionId, userId } = authService.handleLogin(username, avatar);

    setCookie(context, "sessionId", sessionId);
    setCookie(context, "userId", userId);

    return context.redirect("/", 302);
  } catch (err) {
    if (err instanceof ValidationError) {
      return context.json({ message: err.message }, 400);
    }
    console.log(err);
    throw context.json(null, 500);
  }
};
