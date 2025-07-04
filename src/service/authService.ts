import { ContextBean } from "../server.ts";
import { BEAN } from "../constant/Bean.ts";
import { HTTPErrorMessages } from "../constant/messages.ts";
import { UserRepository } from "../repository/userRepository.ts";
import { SessionRepository } from "../repository/sessionRepository.ts";

export interface HandleLoginResponse {
  sessionId: string;
  userId: string;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class AuthService implements ContextBean {
  private readonly _baseName: BEAN = BEAN.authService;
  private readonly userRepository: UserRepository;
  private readonly sessionRepository: SessionRepository;

  constructor(userRepository: UserRepository, sessionRepository: SessionRepository) {
    this.userRepository = userRepository;
    this.sessionRepository = sessionRepository;
  }

  get name(): BEAN {
    return this._baseName;
  }

  private isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    return usernameRegex.test(username);
  }

  private handleNewUserLogin(username: string, avatar: string): HandleLoginResponse {
    const userId = this.userRepository.createUser(username, avatar);
    const sessionId = this.sessionRepository.createSession(userId);

    return { sessionId, userId };
  }

  private processLogin(username: string, avatar: string): HandleLoginResponse {
    const userId = this.userRepository.findIdByUsername(username);
    if (!userId) return this.handleNewUserLogin(username, avatar);

    const sessionId = this.sessionRepository.createSession(userId);

    return { sessionId, userId };
  }

  public handleLogin(username: string, avatar: string): HandleLoginResponse {
    if (!username || !avatar) {
      throw new ValidationError(HTTPErrorMessages.USERNAME_AND_AVATAR_INVALID);
    }

    if (!this.isValidUsername(username)) {
      throw new ValidationError(HTTPErrorMessages.USERNAME_INVALID);
    }

    return this.processLogin(username, avatar);
  }
}