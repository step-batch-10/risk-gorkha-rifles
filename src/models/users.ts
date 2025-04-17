import _ from "npm:lodash";

export interface UserDetail {
  userName: string;
  userId: string;
}

export default class Users {
  public users: Map<string, string> = new Map();
  public uniqueId: () => string;

  constructor(uniqueId: () => string = () => "1") {
    this.uniqueId = uniqueId;
  }

  createUser(userName: string) {
    const userId = this.uniqueId();
    this.users.set(userId, userName);

    return userId;
  }

  findById(userId: string) {
    return this.users.get(userId);
  }

  findByUserName(userName: string) {
    for (const [key, value] of this.users) {
      if (userName === value) return key;
    }
  }
}
