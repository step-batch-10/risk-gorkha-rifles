import { assert } from "assert";
import { describe, it } from "jsr:@std/testing/bdd";
import Server from "../src/server.ts";
import { Hono } from "hono";

describe("Server", () => {
  it("should initialize with an instance of Hono", () => {
    const server = new Server();
    assert(server.app instanceof Hono);
  });

  it("should call appMethod during initialization", () => {
    const server = new Server();
    assert(server.app.routes.length > 0);
  });
});
