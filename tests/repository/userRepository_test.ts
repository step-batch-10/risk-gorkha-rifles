import { describe, it } from "testing";
import { assertEquals, assertExists } from "assert";

import { UserRepository } from "../../src/repository/userRepository.ts";

describe("UserRepository", () => {
  it("creates a user and returns an ID", () => {
    const createId = () => "user-123";
    const repo = new UserRepository(createId);

    const id = repo.createUser("alice", "avatar.png");

    assertEquals(id, "user-123");
    const user = repo.findUserById(id);
    assertExists(user);
    assertEquals(user, { username: "alice", avatar: "avatar.png" });
  });

  it("returns undefined for findUserById when user does not exist", () => {
    const repo = new UserRepository(() => "user-123");

    const user = repo.findUserById("non-existent");

    assertEquals(user, undefined);
  });

  it("finds user ID by username", () => {
    let count = 0;
    const createId = () => `id-${count++}`;
    const repo = new UserRepository(createId);

    const userId = repo.createUser("carol", "avatar2.png");

    const result = repo.findIdByUsername("carol");
    assertEquals(result, userId);
  });

  it("returns undefined for unknown username in findIdByUsername", () => {
    const repo = new UserRepository(() => "id-1");
    repo.createUser("dave", "avatar.png");

    const result = repo.findIdByUsername("eve");
    assertEquals(result, undefined);
  });

  it("getAllUsers returns all users with IDs", () => {
    const ids = ["id1", "id2"];
    let i = 0;
    const createId = () => ids[i++];
    const repo = new UserRepository(createId);

    repo.createUser("frank", "avatar1.png");
    repo.createUser("grace", "avatar2.png");

    const all = repo.getAllUsers();
    assertEquals(all, [
      { id: "id1", username: "frank", avatar: "avatar1.png" },
      { id: "id2", username: "grace", avatar: "avatar2.png" },
    ]);
  });
});