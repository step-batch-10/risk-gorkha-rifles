import { assertEquals } from "assert";
import { describe, it } from "testing";
import Server from "../../src/server.ts";
import Users from "../../src/models/users.ts";
import Session from "../../src/models/session.ts";
import GameManager from "../../src/models/gameManager.ts";

describe("tests for app login routes", () => {
  it("Should give status 400 if username not given", async () => {
    const users = new Users();
    const session = new Session();
    const gameManager = new GameManager();
    const server = new Server(users, session, gameManager, () => "1");
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({}),
    });

    assertEquals(response.status, 400);
  });

  it("Should set the cookies", async () => {
    const users = new Users();
    const session = new Session();
    const gameManager = new GameManager();
    const server = new Server(users, session, gameManager, () => "1");
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "Ankita" }),
    });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get("set-cookie"), "sessionId=1; Path=/");
  });

  it("should create the user if doesn't exist", async () => {
    const users = new Users();
    const session = new Session();
    const gameManager = new GameManager();
    const server = new Server(users, session, gameManager, () => "1");
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "Ankita" }),
    });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get("set-cookie"), "sessionId=1; Path=/");
    assertEquals(users.findByUserName("Ankita"), "1");
  });

  it("should create a new session on each login", async () => {
    const users = new Users();
    const session = new Session();
    const gameManager = new GameManager();
    const server = new Server(users, session, gameManager, () => "1");
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
    const users = new Users();
    const session = new Session();
    const gameManager = new GameManager();
    const server = new Server(users, session, gameManager, () => "1");
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "*" }),
    });

    assertEquals(response.status, 400);
  });

  it("should give 400 if username starts with number", async () => {
    const users = new Users();
    const session = new Session();
    const gameManager = new GameManager();
    const server = new Server(users, session, gameManager, () => "1");
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "45dhs" }),
    });

    assertEquals(response.status, 400);
  });

  it("should give 400 if username has invalid character in between", async () => {
    const users = new Users();
    const session = new Session();
    const gameManager = new GameManager();
    const server = new Server(users, session, gameManager, () => "1");
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "hdjsk&^%6jdk" }),
    });

    assertEquals(response.status, 400);
  });
});

describe("tests for auth middleware", () => {
  it("should return 401 unauthorized if user logged in", async () => {
    const users = new Users();
    const session = new Session();
    const gameManager = new GameManager();
    const server = new Server(users, session, gameManager, () => "1");
    const response = await server.app.request("/game/game-board");

    assertEquals(response.status, 302);
  });

  it("should pass the middleware if user logged in", async () => {
    const users = new Users();
    users.createUser("john");
    const session = new Session();
    session.createSession("1");
    const gameManager = new GameManager();

    const server = new Server(users, session, gameManager, () => "1");
    const response = await server.app.request("/game/game-board", {
      method: "GET",
      headers: {
        Cookie: "sessionId=1",
      },
    });

    assertEquals(response.status, 200);
  });
});
