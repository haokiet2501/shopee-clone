import type { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'

const authApi = {
  // Kết nối api register phần auth
  registerAccount(body: { email: string; password: string }) {
    return http.post<AuthResponse>('/register', body)
  },

  // Kết nối api login phần auth
  loginAccount(body: { email: string; password: string }) {
    return http.post<AuthResponse>('/login', body)
  },

  // Đăng xuất auth
  logout() {
    return http.post('/logout')
  }
}

export default authApi
