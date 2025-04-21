import { assertEquals } from "assert";
import { describe, it } from "testing";
import Users from "../../src/models/users.ts";

describe("tests for users model", () => {
  it("should create user", () => {
    const userName = "Pirate";
    const avatar = "avatar";
    const user = new Users();
    const actual = user.createUser(userName, avatar);

    assertEquals(actual, { userName: "Pirate", avatar: "avatar" });
  });

  it("should find the user using userId", () => {
    const userName = "Pirate";
    const avatar = "avatar";
    const user = new Users();
    user.createUser(userName, avatar);
    const actual = user.findById("1");

    assertEquals(actual, { userName: "Pirate", avatar: "avatar" });
  });

  it("should return undefined if userId doesn't exist", () => {
    const user = new Users();
    const actual = user.findById("1");

    assertEquals(actual, undefined);
  });

  it("should find the user using userName", () => {
    const userName = "Pirate";
    const avatar = "avatar";
    const user = new Users();
    user.createUser(userName, avatar);
    const actual = user.findIdByUsername("Pirate");

    assertEquals(actual, "1");
  });

  it("should return undefined if userName doesn't exist", () => {
    const user = new Users();
    const actual = user.findIdByUsername("Cowboy");

    assertEquals(actual, undefined);
  });
});
