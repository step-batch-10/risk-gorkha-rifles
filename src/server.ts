import Users from "./models/users.ts";
import { logger } from "hono/logger";
import { serveStatic } from "hono/deno";
import { Context, Hono, Next } from "hono";
import Session from "./models/session.ts";
import { BlankEnv, BlankSchema } from "hono/types";
import { loginHandler } from "./handler/authHandler.ts";
import GameManager from "./models/gameManager.ts";
import {
  boardDataHandler,
  joinGameHandler,
  updateTroops,
  fetchPlayerInfo,
} from "./handler/gameHandler.ts";
import { getCookie } from "hono/cookie";

type App = Hono<BlankEnv, BlankSchema, "/">;

export default class Server {
  readonly app: App;
  users: Users;
  session: Session;
  gameManager: GameManager;
  uniqueId: () => string;

  constructor(
    users: Users,
    session: Session,
    gameManager: GameManager,
    uniqueId: () => string
  ) {
    this.app = new Hono();
    this.appMethod(this.app);
    this.users = users;
    this.session = session;
    this.gameManager = gameManager;
    this.uniqueId = uniqueId;
  }

  private async setContext(context: Context, next: Next) {
    context.set("users", this.users);
    context.set("session", this.session);
    context.set("uniqueId", this.uniqueId);
    context.set("gameManager", this.gameManager);

    return await next();
  }

  private async authHandler(ctx: Context, next: Next) {
    const sessionId = getCookie(ctx, "sessionId");

    const session = ctx.get("session");

    if (session.sessions.has(sessionId || "0")) {
      ctx.set("userId", session.findById(sessionId));
      return await next();
    }

    return ctx.redirect("/login", 302);
  }

  private gameHandler() {
    const app = new Hono();
    app.use(this.authHandler);
    app.get("/game-board", boardDataHandler);
    app.post("/join-game", joinGameHandler);
    app.post("/update-troops", updateTroops);
    app.get("/profile-details", fetchPlayerInfo);
    return app;
  }

  private appMethod(app: App) {
    app.use(logger());
    app.use(this.setContext.bind(this));
    app.post("/login", loginHandler);
    app.use("/", this.authHandler);
    app.route("/game", this.gameHandler());
    app.get("*", serveStatic({ root: "./public/" }));
  }
}
