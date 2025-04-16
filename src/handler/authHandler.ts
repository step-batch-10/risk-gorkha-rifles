import { Context } from "hono";
import Users from "../models/users.ts";
import { setCookie } from 'hono/cookie';
import Session from "../models/session.ts";

export const loginHandler = async (context: Context) => {
  const { username } = await context.req.json();
  if (!username) return context.json({ message: 'Username must be filled out' }, 400);
  const users: Users = context.get('users');

  if (!users.findByUserName(username)) {
    users.createUser(username);
  }

  const sessions: Session = context.get('session');
  const sessionId = sessions.createSession(username);

  setCookie(context, 'sessionId', sessionId);
  return context.redirect('/', 302);
};
