import type { User } from "./user.type";
import type { SuccessResponse } from "./utils.type";

// Type Auth này để trả về access_token và expires user khi đăng nhập
export type AuthResponse = SuccessResponse<{
  access_token: string
  expires: string
  user: User
}>