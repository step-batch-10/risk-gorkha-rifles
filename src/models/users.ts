import _ from "npm:lodash";

export interface User {
  username: string;
  avatar: string;
}

export default class Users {
  private users: Record<string, User> = {};
  private uniqueId: () => string;

  constructor(uniqueId: () => string = () => "1") {
    this.uniqueId = uniqueId;
  }

  createUser(username: string, avatar: string) {
    const userId = this.uniqueId();
    this.users[userId] = { username, avatar };

    return this.users[userId];
  }

  findById(userId: string) {
    return this.users[userId];
  }

  findIdByUsername(name: string) {
    const userDetails = Object.entries(this.users).find(
      ([_, { username }]) => username === name
    );

    return userDetails ? userDetails[0] : undefined;
  }
}
