import { describe, it } from "testing";
import { assertEquals } from "assert";
import AccountService from "../../src/service/accountService.ts";
import { UserProfile, UserRepository } from "../../src/repository/userRepository.ts";

describe('Account Service', () => {
  it('should return the user profile details', () => {
    const userRepository = new UserRepository(() => "1");
    userRepository.createUser("test", "avatar_url");
    const accountService = new AccountService(userRepository);
    const userProfile: UserProfile | undefined = accountService.getUserProfile("1");

    assertEquals("test", userProfile?.username);
    assertEquals("avatar_url", userProfile?.avatar);
  });

  it('should return undefined if user ID is invalid', () => {
    const userRepository = new UserRepository(() => "1");
    const accountService = new AccountService(userRepository);
    const userProfile: UserProfile | undefined = accountService.getUserProfile("1");

    assertEquals(undefined, userProfile);
  });
});