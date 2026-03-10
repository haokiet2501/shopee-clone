type Role = 'User' | 'Admin'
// Các giá trị trả về của một api user.
export interface User {
  _id: string
  // Roles để xét cho user có 2 quyền 1 là Admin 2 là User
  roles: Role[]
  email: string
  name: string
  date_of_birth: null
  address: string
  phone: string
  createdAt: string
  updatedAt: string
}
