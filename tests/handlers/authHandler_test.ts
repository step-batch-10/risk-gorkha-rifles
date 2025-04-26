import { assertEquals } from "assert";
import { describe, it } from "testing";
import { createServerWithLoggedInUser } from "./gameHandler_test.ts";

const uniqueId = () => () => "1";

describe("tests for app login routes", () => {
  it("Should give status 400 if username not given", async () => {
    const { app } = createServerWithLoggedInUser("Jack", uniqueId);

    const response = await app.request("/login", {
      method: "POST",
      body: JSON.stringify({}),
    });

    assertEquals(response.status, 400);
  });

  it("Should set the cookies", async () => {
    const { app } = createServerWithLoggedInUser("Rose", uniqueId);
    const response = await app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "Rose", avatar: "url" }),
    });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get("set-cookie"), "sessionId=1; Path=/");
  });

  it("should create the user if doesn't exist", async () => {
    const { app, users } = createServerWithLoggedInUser("Ankita", uniqueId);
    const response = await app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "Ankita", avatar: "url" }),
    });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get("set-cookie"), "sessionId=1; Path=/");
    assertEquals(users.findIdByUsername("Ankita"), "1");
  });

  it("should create a new session on each login", async () => {
    const { app, users, session } = createServerWithLoggedInUser(
      "Jack",
      uniqueId
    );
    const response = await app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "Ankita", avatar: "url" }),
    });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get("set-cookie"), "sessionId=1; Path=/");
    assertEquals(users.findIdByUsername("Ankita"), "1");
    assertEquals(session.findById("1"), "1");
  });

  it("should give 400 if username is not valid", async () => {
    const { app } = createServerWithLoggedInUser("Jack", uniqueId);
    const response = await app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "*", avatar: "url" }),
    });

    assertEquals(response.status, 400);
  });

  it("should give 400 if username starts with number", async () => {
    const { app } = createServerWithLoggedInUser("", uniqueId);
    const response = await app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "45dhs", avatar: "url" }),
    });

    assertEquals(response.status, 400);
  });

  it("should give 400 if username has invalid character in between", async () => {
    const { app } = createServerWithLoggedInUser("", uniqueId);
    const response = await app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "hdjsk&^%6jdk", avatar: "url" }),
    });

    assertEquals(response.status, 400);
  });

  it("should give 400 if avatar is not given", async () => {
    const { app } = createServerWithLoggedInUser("", uniqueId);
    const response = await app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "hdjsk&^%6jdk" }),
    });

    assertEquals(response.status, 400);
  });
});
