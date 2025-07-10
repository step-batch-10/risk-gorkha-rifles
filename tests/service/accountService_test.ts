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

  const inc = () => {
    let i = 1;
    return () => (i++).toString();
  };

  it('should build player profiles', () => {
    const userRepository = new UserRepository(inc());
    userRepository.createUser("user 1", "avatar 1");
    userRepository.createUser("user 2", "avatar 2");
    userRepository.createUser("user 3", "avatar 3");
    userRepository.createUser("user 4", "avatar 4");

    const accountService = new AccountService(userRepository);
    const playerProfiles: UserProfile[] = accountService.buildProfiles(["1", "2", "3", "4"]);

    const expected = [
      { username: "user 1", avatar: "avatar 1" },
      { username: "user 2", avatar: "avatar 2" },
      { username: "user 3", avatar: "avatar 3" },
      { username: "user 4", avatar: "avatar 4" },
    ];

    assertEquals(expected, playerProfiles);
  });
});