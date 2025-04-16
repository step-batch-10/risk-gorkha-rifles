import Users from "./models/users.ts";
import { logger } from "hono/logger";
import { serveStatic } from "hono/deno";
import { Context, Hono, Next } from "hono";
import Session from "./models/session.ts";
import { BlankEnv, BlankSchema } from "hono/types";
import { loginHandler } from "./handler/authHandler.ts";

type App = Hono<BlankEnv, BlankSchema, "/">;

export default class Server {
  app: App;
  users: Users; session: Session; uniqueId: () => string;

  constructor(users: Users, session: Session, uniqueId: () => string) {
    this.app = new Hono();
    this.appMethod(this.app);
    this.users = users;
    this.session = session;
    this.uniqueId = uniqueId;
  }

  start() {
    console.log("Server is started");
    Deno.serve({ port: 3000 }, this.app.fetch);
  }

  private async setContext(context: Context, next: Next) {
    context.set('users', this.users);
    context.set('session', this.session);
    context.set('uniqueId', this.uniqueId);

    return await next();
  };

  private appMethod(app: App) {
    app.use(logger());
    app.use(this.setContext.bind(this));

    app.get("/test", (c) => {
      return c.text("connected");
    });
    app.post("/login", loginHandler);
    app.get("*", serveStatic({ root: "./public/" }));
  }
}
