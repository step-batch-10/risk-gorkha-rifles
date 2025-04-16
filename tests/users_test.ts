import { assertEquals } from "assert";
import { describe, it } from "testing";
import Users from "../src/models/users.ts";

describe("tests for users model", () => {
  it("should create user", () => {
    const user = new Users();
    const actual = user.createUser("Ankita");

    assertEquals(actual, [{ userName: "Ankita", userId: "1" }]);
  });

  it("should find the user using userId", () => {
    const user = new Users();
    user.createUser("Ankita");
    const actual = user.findById("1");

    assertEquals(actual, { userName: "Ankita", userId: "1" });
  });

  it("should return undefined if userId doesn't exist", () => {
    const user = new Users();
    const actual = user.findById("1");

    assertEquals(actual, undefined);
  });

  it("should find the user using userName", () => {
    const user = new Users();
    user.createUser("Ankita");
    const actual = user.findByUserName("Ankita");

    assertEquals(actual, { userName: "Ankita", userId: "1" });
  });

  it("should return undefined if userName doesn't exist", () => {
    const user = new Users();
    const actual = user.findByUserName("Ankita");

    assertEquals(actual, undefined);
  });
});
