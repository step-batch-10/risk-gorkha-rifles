import { assertEquals } from "assert";
import { describe, it } from "testing";
import Server from "../src/server.ts";

describe("tests for app dynamic routes", () => {
  it("tests for login route", async () => {
    const server = new Server();
    const response = await server.app.request("/login", {
      method: "POST",
      body: JSON.stringify({ username: "Ankita" }),
    });

    assertEquals(response.status, 200);
  });
});
