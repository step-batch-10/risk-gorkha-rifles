import { describe, it } from "testing";
import { assertEquals, assertThrows } from "assert";
import { AuthService, ValidationError } from "../../src/service/authService.ts";
import { UserRepository } from "../../src/repository/userRepository.ts";
import { SessionRepository } from "../../src/repository/sessionRepository.ts";
import { HTTPErrorMessages } from "../../src/constant/messages.ts";

const createMockedAuthService = () => {
  const userRepo = new UserRepository(() => "1");
  const sessionRepo = new SessionRepository(() => "1");

  return new AuthService(userRepo, sessionRepo);
};

describe("AuthService", () => {
  it("should create a new user and session if user does not exist", () => {
    const authService = createMockedAuthService();
    const result = authService.handleLogin("new_user", "avatar.png");

    assertEquals(result.userId, "1");
    assertEquals(result.sessionId, "1");
  });

  it("should return existing user and create new session", () => {
    const authService = createMockedAuthService();
    const first = authService.handleLogin("existing_user", "avatar.png");
    const second = authService.handleLogin("existing_user", "avatar2.png");

    assertEquals(first.userId, second.userId);
  });

  it("should throw ValidationError for empty username or avatar", () => {
    const authService = createMockedAuthService();

    assertThrows(
      () => authService.handleLogin("", "avatar.png"),
      ValidationError,
      HTTPErrorMessages.USERNAME_AND_AVATAR_INVALID
    );

    assertThrows(
      () => authService.handleLogin("valid_user", ""),
      ValidationError,
      HTTPErrorMessages.USERNAME_AND_AVATAR_INVALID
    );
  });

  it("should throw ValidationError for invalid usernames", () => {
    const authService = createMockedAuthService();
    const invalidUsernames = ["1invalid", "has space", "!wrong"];

    for (const username of invalidUsernames) {
      assertThrows(
        () => authService.handleLogin(username, "avatar.png"),
        ValidationError,
        HTTPErrorMessages.USERNAME_INVALID
      );
    }
  });

  it("should accept valid usernames and create session", () => {
    const authService = createMockedAuthService();
    const usernames = ["validUser", "Valid_123", "_underscore"];

    for (const username of usernames) {
      const result = authService.handleLogin(username, "avatar.png");
      assertEquals(typeof result.userId, "string");
      assertEquals(typeof result.sessionId, "string");
    }
  });
});
