import { Context } from "hono";
import Users from "../models/users.ts";
import { setCookie } from "hono/cookie";
import Session from "../models/session.ts";

const isValidUsername = (username: string) => {
  const usernameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

  return usernameRegex.test(username);
};

const invalidUsernameResponse = (context: Context) => {
  const errorMessage = "Username must contain only letters, numbers, and underscores, and cannot start with a number";

  return context.json({ message: errorMessage }, 400);
};

const createUserIfNew = (users: Users, username: string, avatar: string) => {
  if (!users.findIdByUsername(username)) {
    users.createUser(username, avatar);
  }
};

export const loginHandler = async (context: Context) => {
  const { username, avatar } = await context.req.json();
  if (!username)
    return context.json({ message: "Username must be filled out" }, 400);

  if (!isValidUsername(username)) return invalidUsernameResponse(context);

  const users: Users = context.get("users");
  createUserIfNew(users, username, avatar);

  const userId = users.findIdByUsername(username);
  const session: Session = context.get("session");
  const sessionId = session.createSession(userId);

  setCookie(context, "sessionId", sessionId);
  setCookie(context, "userId", userId as string);

  return context.redirect("/", 302);
};