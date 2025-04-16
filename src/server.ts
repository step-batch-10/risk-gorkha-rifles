import { Hono } from "hono";
import { logger } from "hono/logger";
import { BlankEnv, BlankSchema } from "hono/types";
import { serveStatic } from "hono/deno";
import { loginHandler } from "./handler/authHandler.ts";

export default class Server {
  app: Hono<BlankEnv, BlankSchema, "/">;

  constructor() {
    this.app = new Hono();
    this.appMethod(this.app);
  }

  start() {
    console.log("Server is started");
    Deno.serve({ port: 3000 }, this.app.fetch);
  }

  private appMethod(app: Hono<BlankEnv, BlankSchema, "/">) {
    app.use(logger());
    app.get("/test", (c) => {
      return c.text("connected");
    });
    app.post("/login", loginHandler);
    app.get("*", serveStatic({ root: "./public/" }));
  }
}
