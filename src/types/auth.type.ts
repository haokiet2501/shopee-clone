import type { User } from "./user.type";
import type { ResponseApi } from "./utils.type";

// Type Auth này để trả về access_token và expires user khi đăng nhập
export type AuthResponse = ResponseApi<{
  access_token: string
  expires: string
  user: User
}>