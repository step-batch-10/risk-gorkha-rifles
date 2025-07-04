import { Context, Hono, Next } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/deno";

import { BEAN } from "./constants/Bean.ts";
import { BlankEnv, BlankSchema } from "hono/types";
import { loginHandler } from "./handlers/authHandler.ts";

type App = Hono<BlankEnv, BlankSchema, "/">;

export interface ContextBean {
  name: BEAN;
}

export default class Server {
  private readonly app: App;
  private readonly beans: ContextBean[];

  constructor(app: Hono, beans: ContextBean[]) {
    this.app = app;
    this.beans = beans;
  }

  private handleAuthRoutes(): App {
    const authRoutes = new Hono();
    authRoutes.post("/login", loginHandler);

    return authRoutes;
  }

  private setContext(context: Context, next: Next) {
    this.beans.forEach((bean) => {
      context.set(bean.name, bean);
    });

    return next();
  }

  private registerRoutes(app: App) {
    app.use(logger());
    app.use(this.setContext.bind(this));
    app.route("auth", this.handleAuthRoutes());
    app.get("*", serveStatic({ root: "./public/" }));
  }

  public initialize() {
    this.registerRoutes(this.app);

    return this.app.fetch;
  }
}