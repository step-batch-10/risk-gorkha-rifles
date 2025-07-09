import { Context } from "hono";
import { BEAN } from "../constant/Bean.ts";
import { HTTPErrorMessages } from '../constant/messages.ts';
import AccountService from "../service/accountService.ts";

export const profileHandler = (context: Context) => {
  const userId: string = context.get("userId");
  const accountService: AccountService = context.get(BEAN.accountService);
  const userProfile = accountService.getUserProfile(userId);

  if (!userProfile) {
    return context.json({
      message: HTTPErrorMessages.USER_NOT_FOUND
    }, 404);
  }

  return context.json(userProfile);
};