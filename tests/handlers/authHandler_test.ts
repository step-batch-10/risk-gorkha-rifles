import { assertEquals } from "assert";
import { describe, it } from "testing";
import { createServerWithLoggedInUser } from "./gameHandler_test.ts";

describe("tests for app login routes", () => {
  it("Should give status 400 if username not given", async () => {
    const { server } = createServerWithLoggedInUser("Jack");
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({}),
    });

    assertEquals(response.status, 400);
  });

  it("Should set the cookies", async () => {
    const { server } = createServerWithLoggedInUser("Rose");
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "Rose" }),
    });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get("set-cookie"), "sessionId=1; Path=/");
  });

  it("should create the user if doesn't exist", async () => {
    const { server, users } = createServerWithLoggedInUser("Ankita");
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "Ankita" }),
    });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get("set-cookie"), "sessionId=1; Path=/");
    assertEquals(users.findByUserName("Ankita"), "1");
  });

  it("should create a new session on each login", async () => {
    const { server, users, session } = createServerWithLoggedInUser("Jack");
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "Ankita" }),
    });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get("set-cookie"), "sessionId=1; Path=/");
    assertEquals(users.findByUserName("Ankita"), "1");
    assertEquals(session.findById("1"), "1");
  });

  it("should give 400 if username is not valid", async () => {
    const { server } = createServerWithLoggedInUser("Jack");
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "*" }),
    });

    assertEquals(response.status, 400);
  });

  it("should give 400 if username starts with number", async () => {
    const { server } = createServerWithLoggedInUser("");
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "45dhs" }),
    });

    assertEquals(response.status, 400);
  });

  it("should give 400 if username has invalid character in between", async () => {
    const { server } = createServerWithLoggedInUser("");
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "hdjsk&^%6jdk" }),
    });

    assertEquals(response.status, 400);
  });
});

