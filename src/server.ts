import Users from "./models/users.ts";
import { logger } from "hono/logger";
import { serveStatic } from "hono/deno";
import { Context, Hono, Next } from "hono";
import Session from "./models/session.ts";
import { BlankEnv, BlankSchema } from "hono/types";
import { loginHandler } from "./handler/authHandler.ts";
import GameManager from "./models/gameManager.ts";
import {
  gameActionsHandler,
  lobbyStatusHandler,
  joinGameHandler,
  profileDetailsHandler,
  fullProfileDetailsHandler,
  updateTroopsHandler,
  requestReinforcementHandler,
  requestAttackHandler,
  startGameHandler,
  cardsHandler,
  defendingTerritories,
  getDefendingPlayer,
  storeTroops,
  fortificationHandler,
  connectedTerritoriesHandler,
} from "./handler/gameHandler.ts";
import { getCookie } from "hono/cookie";

type App = Hono<BlankEnv, BlankSchema, "/">;

export default class Server {
  private app: App;
  private users: Users;
  private session: Session;
  private gameManager: GameManager;
  private uniqueId: () => string;

  constructor(
    users: Users,
    session: Session,
    gameManager: GameManager,
    uniqueId: () => string
  ) {
    this.app = new Hono();
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
    const sessionId = getCookie(ctx, "sessionId") || "0";
    const session = ctx.get("session");

    if (sessionId in session.allSessions) {
      ctx.set("userId", session.findById(sessionId));
      return await next();
    }

    return ctx.redirect("/login", 302);
  }

  private gameHandler() {
    const app = new Hono();
    app.use(this.authHandler);
    app.get("/actions", gameActionsHandler);
    app.post("/join-game", joinGameHandler);
    app.get("/lobby-status", lobbyStatusHandler);
    app.get("/profile-details", profileDetailsHandler);
    app.get("/player-full-profile", fullProfileDetailsHandler);
    app.post("/update-troops", updateTroopsHandler);
    app.get("/request-reinforcement", requestReinforcementHandler);
    app.get("/request-attack", requestAttackHandler);
    app.get("/start-game", startGameHandler);
    app.get("/cards", cardsHandler);
    app.post("/request-defendTerritories", defendingTerritories);
    app.post("/request-defendingPlayer", getDefendingPlayer);
    app.post("/troops-to-attack", storeTroops);
    app.post("/troops-to-defend", storeTroops);
    app.post('/fortification', fortificationHandler)
    app.get("/connected-territories", connectedTerritoriesHandler);
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

  get getApp() {
    return this.app;
  }

  public serve() {
    this.appMethod(this.app);

    return this.app.fetch;
  }
}
