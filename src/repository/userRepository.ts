export class UserRepository {
  private users: Map<string, { username: string; avatar: string; }> = new Map();
  private createId: () => string;

  constructor(createId: () => string) {
    this.createId = createId;
  }

  public createUser(username: string, avatar: string): string {
    const userId = this.createId();
    this.users.set(userId, { username, avatar });
    return userId;
  }

  public findUserById(userId: string): { username: string; avatar: string; } | undefined {
    return this.users.get(userId);
  }

  public findIdByUsername(username: string): string | undefined {
    for (const [id, user] of this.users.entries()) {
      if (user.username === username) {
        return id;
      }
    }
    return undefined;
  }

  public getAllUsers(): Array<{ id: string; username: string; avatar: string; }> {
    return Array.from(this.users.entries()).map(([id, user]) => ({
      id,
      ...user,
    }));
  }
}