import { describe, it } from "testing";
import { assertEquals, assertExists } from "assert";

import { SessionRepository } from "../../src/repository/sessionRepository.ts";


describe("SessionRepository", () => {
  it("creates a session and returns a session ID", () => {
    const createId = () => "session-abc";
    const repo = new SessionRepository(createId);

    const sessionId = repo.createSession("user-1");

    assertEquals(sessionId, "session-abc");

    const session = repo.findSessionById(sessionId);
    assertExists(session);
    assertEquals(session, { userId: "user-1" });
  });

  it("returns undefined for unknown session ID", () => {
    const repo = new SessionRepository(() => "any");

    const result = repo.findSessionById("non-existent-session");

    assertEquals(result, undefined);
  });

  it("returns all sessions with sessionId and userId", () => {
    const ids = ["s1", "s2"];
    let index = 0;
    const createId = () => ids[index++];
    const repo = new SessionRepository(createId);

    const sid1 = repo.createSession("u1");
    const sid2 = repo.createSession("u2");

    const all = repo.getAllSessions();

    assertEquals(all.length, 2);
    assertEquals(all, [
      { sessionId: sid1, userId: "u1" },
      { sessionId: sid2, userId: "u2" },
    ]);
  });

  it("handles an empty session list correctly", () => {
    const repo = new SessionRepository(() => "unused");

    const sessions = repo.getAllSessions();

    assertEquals(sessions, []);
  });

  it("validates session existence", () => {
    const createId = () => "valid-session";
    const repo = new SessionRepository(createId);

    const sessionId = repo.createSession("user-1");

    assertEquals(repo.isValidSession(sessionId), true);
    assertEquals(repo.isValidSession("invalid-session"), false);
  });

  it("deletes a session", () => {
    const createId = () => "session-to-delete";
    const repo = new SessionRepository(createId);

    const sessionId = repo.createSession("user-1");
    assertEquals(repo.isValidSession(sessionId), true);

    repo.deleteSession(sessionId);
    assertEquals(repo.isValidSession(sessionId), false);
  });

  it("returns the correct bean name", () => {
    const createId = () => "any-session";
    const repo = new SessionRepository(createId);

    assertEquals(repo.name, "sessionRepository");
  });
});