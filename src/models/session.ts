export default class Session {
  readonly sessions: Map<string, string>;
  private uniqueId: () => string;

  constructor(uniqueId: () => string = () => "1") {
    this.uniqueId = uniqueId;
    this.sessions = new Map();
  }

  public createSession(userId: string) {
    const sessionId = this.uniqueId();
    this.sessions.set(sessionId, userId);

    return sessionId;
  }

  public findById(sessionId: string) {
    return this.sessions.get(sessionId);
  }

  public deleteSession(sessionId: string) {
    return this.sessions.delete(sessionId);
  }

  public deleteUsersSession(userId: string) {
    for (const [key, value] of this.sessions) {
      if (value === userId) this.deleteSession(key);
    }

    return this.sessions;
  }
}
