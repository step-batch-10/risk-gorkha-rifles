import { Context } from "hono";
import Users from "../models/users.ts";
import { setCookie } from "hono/cookie";
import Session from "../models/session.ts";

export const loginHandler = async (context: Context) => {
  const { username, avatar } = await context.req.json();
  if (!username)
    return context.json({ message: "Username must be filled out" }, 400);

  const usernameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  if (!usernameRegex.test(username)) {
    return context.json(
      {
        message:
          "Username must contain only letters, numbers, and underscores, and cannot start with a number",
      },
      400
    );
  }

  const users: Users = context.get("users");

  if (!users.findIdByUsername(username)) {
    users.createUser(username, avatar);
  }

  const userId = users.findIdByUsername(username);
  const sessions: Session = context.get("session");
  const sessionId = sessions.createSession(userId);

  setCookie(context, "sessionId", sessionId);
  setCookie(context, "userId", userId as string);
  return context.redirect("/", 302);
};
