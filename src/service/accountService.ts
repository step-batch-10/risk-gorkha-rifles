import { BEAN } from "../constant/Bean.ts";
import { UserProfile, UserRepository } from "../repository/userRepository.ts";
import { ContextBean } from "../server.ts";

export default class AccountService implements ContextBean {
  private readonly _baseName: BEAN = BEAN.accountService;
  private readonly userRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public getUserProfile(userId: string): UserProfile | undefined {
    return this.userRepository.findUserById(userId);
  }

  get name(): BEAN {
    return this._baseName;
  }
};