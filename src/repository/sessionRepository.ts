import { BEAN } from "../constant/Bean.ts";
import { ContextBean } from "../server.ts";

export class SessionRepository implements ContextBean {
  public readonly _basename = BEAN.sessionRepository;
  private sessions: Map<string, { userId: string; }> = new Map();
  private createId: () => string;

  constructor(createId: () => string) {
    this.createId = createId;
  }

  public createSession(userId: string): string {
    const sessionId = this.createId();
    this.sessions.set(sessionId, { userId });
    return sessionId;
  }

  public findSessionById(sessionId: string): { userId: string; } | undefined {
    return this.sessions.get(sessionId);
  }

  public getAllSessions(): Array<{ sessionId: string; userId: string; }> {
    return Array.from(this.sessions.entries()).map(([sessionId, session]) => ({
      sessionId,
      userId: session.userId,
    }));
  }

  public isValidSession(sessionId: string): boolean {
    return this.sessions.has(sessionId);
  }

  public deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  get name(): BEAN {
    return this._basename;
  }
}