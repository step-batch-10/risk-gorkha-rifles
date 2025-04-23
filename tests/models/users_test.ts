import { assertEquals } from "assert";
import { describe, it } from "testing";
import Users from "../../src/models/users.ts";

describe("tests for users model", () => {
  it("should create user", () => {
    const username = "Pirate";
    const avatar = "avatar";
    const user = new Users();
    const actual = user.createUser(username, avatar);

    assertEquals(actual, { username: "Pirate", avatar: "avatar" });
  });

  it("should find the user using userId", () => {
    const username = "Pirate";
    const avatar = "avatar";
    const user = new Users();
    user.createUser(username, avatar);
    const actual = user.findById("1");

    assertEquals(actual, { username: "Pirate", avatar: "avatar" });
  });

  it("should return undefined if userId doesn't exist", () => {
    const user = new Users();
    const actual = user.findById("1");

    assertEquals(actual, undefined);
  });

  it("should find the user using username", () => {
    const username = "Pirate";
    const avatar = "avatar";
    const user = new Users();
    user.createUser(username, avatar);
    const actual = user.findIdByUsername("Pirate");

    assertEquals(actual, "1");
  });

  it("should return undefined if username doesn't exist", () => {
    const user = new Users();
    const actual = user.findIdByUsername("Cowboy");

    assertEquals(actual, undefined);
  });
});
