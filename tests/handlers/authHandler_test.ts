import { assertEquals } from "assert";
import { describe, it } from "testing";
import Server from "../../src/server.ts";
import Users from "../../src/models/users.ts";
import Session from "../../src/models/session.ts";

describe("tests for app dynamic routes", () => {
  it("Should give status 400 if username not given", async () => {
    const server = new Server();
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({})
    });

    assertEquals(response.status, 400);
  });

  it("Should set the cookies", async () => {
    const server = new Server();
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "Ankita" })
    });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get("set-cookie"), "sessionId=1; Path=/");
  });

  it("should create the user if doesn't exist", async () => {
    const users = new Users();
    const server = new Server(users);
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "Ankita" })
    });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get("set-cookie"), "sessionId=1; Path=/");
    assertEquals(users.findByUserName("Ankita"), "1");
  });

  it("should create a new session on each login", async () => {
    const users = new Users();
    const session = new Session();
    const server = new Server(users, session, () => "1");
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "Ankita" })
    });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get("set-cookie"), "sessionId=1; Path=/");
    assertEquals(users.findByUserName("Ankita"), "1");
    assertEquals(session.findById("1"), "Ankita");
  });

  it("should give 400 if username is not valid", async () => {
    const users = new Users();
    const session = new Session();
    const server = new Server(users, session, () => "1");
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "*" })
    });

    assertEquals(response.status, 400);
  });

  it("should give 400 if username starts with number", async () => {
    const users = new Users();
    const session = new Session();
    const server = new Server(users, session, () => "1");
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "45dhs" })
    });

    assertEquals(response.status, 400);
  });

  it("should give 400 if username has invalid character in between", async () => {
    const users = new Users();
    const session = new Session();
    const server = new Server(users, session, () => "1");
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "hdjsk&^%6jdk" })
    });

    assertEquals(response.status, 400);
  });
});
