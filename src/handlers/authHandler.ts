import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { AuthService } from "../services/authService.ts";

const isValidUsername = (username: string) => {
  const usernameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

  return usernameRegex.test(username);
};

const invalidUsernameResponse = (context: Context) => {
  const errorMessage = "Username must contain only letters, numbers, and underscores, and cannot start with a number";

  return context.json({ message: errorMessage }, 400);
};

export const loginHandler = async (context: Context) => {
  const { username, _avatar } = await context.req.json();
  if (!username)
    return context.json({ message: "Username must be filled out" }, 400);

  if (!isValidUsername(username)) return invalidUsernameResponse(context);

  const authService: AuthService = context.get("authService");
  const loginResponse = authService.handleLogin();

  setCookie(context, "sessionId", loginResponse.sessionId);
  setCookie(context, "userId", loginResponse.userId);

  return context.redirect("/", 302);
};