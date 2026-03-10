import type { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'

// Kết nối api register phần auth
export const registerAccount = (body: { email: string; password: string }) => http.post<AuthResponse>('/register', body)

// Kết nối api login phần auth
export const loginAccount = (body: { email: string; password: string }) => http.post<AuthResponse>('/login', body)
