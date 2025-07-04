import { logger } from "hono/logger";
import { serveStatic } from "hono/deno";
import { Hono } from "hono";
import { BlankEnv, BlankSchema } from "hono/types";

type App = Hono<BlankEnv, BlankSchema, "/">;

export default class Server {
  private app: App;

  constructor() {
    this.app = new Hono();
  }

  private registerRoutes(app: App) {
    app.use(logger());
    app.get("/hello", (c) => c.text("Hello, World!"));
    app.get("*", serveStatic({ root: "./public/" }));
  }

  get getApp() {
    return this.app;
  }

  public initialize() {
    this.registerRoutes(this.app);

    return this.app.fetch;
  }
}