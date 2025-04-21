import { assertEquals } from "assert";
import { describe, it } from "testing";
import Session from "../../src/models/session.ts";

describe("tests for session model", () => {
  it("should create sessions", () => {
    const session = new Session();
    const actual = session.createSession("123");
    const expected = "1";

    assertEquals(actual, expected);
  });

  it("should find the user by id", () => {
    const uniqueId = () => {
      let i = 0;

      return () => (i++).toString();
    };

    const session = new Session(uniqueId());
    session.createSession("123");
    session.createSession("456");

    assertEquals(session.findById("0"), "123");
    assertEquals(session.findById("1"), "456");
  });

  it("should return undefined if session is not valid", () => {
    const session = new Session();

    const actual = session.findById("1");
    assertEquals(actual, undefined);
  });
});

describe("get allSessions", () => {
  it("should return all sesions", () => {
    const session = new Session();
    session.createSession("2");

    const result = session.allSessions;

    assertEquals(result, { "1": "2" });
  });
});
