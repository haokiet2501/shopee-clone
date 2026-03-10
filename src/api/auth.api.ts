import type { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'

// Kết nối api phần auth
export const registerAccount = (body: { email: string; password: string }) => http.post<AuthResponse>('/register', body)
