export class SessionRepository {
  private sessions: Map<string, { userId: string }> = new Map();
  private createId: () => string;

  constructor(createId: () => string) {
    this.createId = createId;
  }

  public createSession(userId: string): string {
    const sessionId = this.createId();
    this.sessions.set(sessionId, { userId });
    return sessionId;
  }

  public findSessionById(sessionId: string): { userId: string } | undefined {
    return this.sessions.get(sessionId);
  }

  public getAllSessions(): Array<{ sessionId: string; userId: string }> {
    return Array.from(this.sessions.entries()).map(([sessionId, session]) => ({
      sessionId,
      userId: session.userId,
    }));
  }
}