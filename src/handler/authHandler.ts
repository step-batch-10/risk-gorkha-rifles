import { Context } from "hono";
import Users from "../models/users.ts";

export const loginHandler = async (context: Context) => {
  console.log("inside loginHandler");
  const userName = await context.req.json();
  const user = new Users();

  user.createUser(userName);

  return context.json({}, 200);
};
