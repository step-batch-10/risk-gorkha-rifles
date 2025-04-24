import { assert } from "assert";
import { describe, it } from "jsr:@std/testing/bdd";
import Server from "../src/server.ts";
import { Hono } from "hono";
import Users from "../src/models/users.ts";
import Session from "../src/models/session.ts";
import { gameManagerInstanceBuilder } from "./models/gameManager_test.ts";

describe("Server", () => {
  it("should initialize with an instance of Hono", () => {
    const users = new Users();
    const session = new Session();
    const gameManager = gameManagerInstanceBuilder(() => ({ Asia: ["India"] }));
    const server = new Server(users, session, gameManager, () => "1");
    assert(server.getApp instanceof Hono);
  });
});
