import { BEAN } from "../constants/Bean.ts";
import { ContextBean } from "../server.ts";

export interface HandleLoginResponse {
  sessionId: string,
  userId: string,
}

export class AuthService implements ContextBean {
  private readonly _baseName: BEAN = BEAN.authService;

  constructor() { }

  public handleLogin(): HandleLoginResponse {

    return { sessionId: "1", userId: "1" };
  }

  get name(): BEAN {
    return this._baseName;
  }
}