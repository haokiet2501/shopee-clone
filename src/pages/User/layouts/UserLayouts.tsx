import { Outlet } from 'react-router-dom'
import UserSideNav from '../components/UserSideNav'

export default function UserLayouts() {
  return (
    <div>
      <UserSideNav />
      <Outlet />
    </div>
  )
}
