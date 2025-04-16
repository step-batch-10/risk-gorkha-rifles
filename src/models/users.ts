import _ from "npm:lodash";

export interface UserDetail {
  userName: string;
  userId: string;
}

export default class Users {
  public users: UserDetail[] = [];
  public uniqueId: () => string;

  constructor(uniqueId: () => string = () => "1") {
    this.uniqueId = uniqueId;
  }

  createUser(userName: string) {
    const newUser: UserDetail = {
      userName,
      userId: this.uniqueId(),
    };

    this.users.push(newUser);
    return this.users;
  }

  findById(id: string) {
    const user = _.find(this.users, (user: UserDetail) => user.userId === id);
    return user;
  }

  findByUserName(userName: string) {
    const user = _.find(
      this.users,
      (user: UserDetail) => user.userName === userName
    );

    return user;
  }
}
