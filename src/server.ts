import { Context, Hono, Next } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/deno";

import { BEAN } from "./constant/Bean.ts";
import { BlankEnv, BlankSchema } from "hono/types";
import { loginHandler } from "./handler/authHandler.ts";
import { profileHandler } from "./handler/accountHandler.ts";
import { joinLobbyHandler } from "./handler/lobbyHandler.ts";
import { SessionRepository } from "./repository/sessionRepository.ts";
import { getCookie } from "hono/cookie";

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

  private getURLPathname = (url: string): string => {
    return new URLPattern(url).pathname;
  };

  private isApiRoute = (url: string): boolean => {
    const apiRoutes = ["/api"];
    const pathname = this.getURLPathname(url);

    return apiRoutes.some(route => pathname.startsWith(route));
  };

  private isValidSession = (context: Context): boolean => {
    const sessionId = getCookie(context, "sessionId");
    if (!sessionId) return false;

    const sessionRepository: SessionRepository = context.get(BEAN.sessionRepository);
    const session = sessionRepository.findSessionById(sessionId);

    if (!session) return false;
    context.set("userId", session.userId);

    return true;
  };

  private isPrivateStaticRoute(url: string) {
    const privateStaticRoutes = ["/", "/game"];
    const pathname = this.getURLPathname(url);

    return privateStaticRoutes.includes(pathname);
  }

  private async authMiddleware(context: Context, next: Next) {
    if (this.isValidSession(context)) return await next();

    if (this.isApiRoute(context.req.url)) {
      return context.json({ error: "Session ID is required" }, 401);
    }

    if (this.isPrivateStaticRoute(context.req.url)) {
      return context.redirect("/login", 302);
    }

    return await next();
  }

  private handleLobbyRoutes(): App {
    const lobbyRoutes = new Hono();
    lobbyRoutes.post("/join", joinLobbyHandler);

    return lobbyRoutes;
  }

  private handleAPIRoutes(): App {
    const apiRoutes = new Hono();
    apiRoutes.get("/profile", profileHandler);
    apiRoutes.route("/lobby", this.handleLobbyRoutes());

    return apiRoutes;
  }

  private registerRoutes(app: App) {
    app.use(logger());
    app.use(this.setContext.bind(this));
    app.use(this.authMiddleware.bind(this));
    app.route("auth", this.handleAuthRoutes());
    app.route("api", this.handleAPIRoutes());
    app.get("*", serveStatic({ root: "./public/" }));
  }

  public initialize() {
    this.registerRoutes(this.app);

    return this.app.fetch;
  }
}