export default class Session {
  private sessions: Record<string, string> = {};
  private uniqueId: () => string;

  constructor(uniqueId: () => string = () => "1") {
    this.uniqueId = uniqueId;
  }

  public createSession(userId: string = "") {
    const sessionId = this.uniqueId();
    this.sessions[sessionId] = userId;

    return sessionId;
  }

  public findById(sessionId: string) {
    return this.sessions[sessionId];
  }

  get allSessions() {
    return this.sessions;
  }
}
