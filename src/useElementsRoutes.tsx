import { useRoutes } from 'react-router-dom'
import ProductList from './pages/ProductList'
import RegisterLayout from './layout/RegisterLayout'
import Login from './pages/Login'
import Register from './pages/Register'

export default function useElementsRoutes() {
  const routeElements = useRoutes([
    {
      path: '/',
      element: <ProductList />
    },
    {
      path: '/login',
      element: (
        <RegisterLayout>
          <Login />
        </RegisterLayout>
      )
    },
    {
      path: '/register',
      element: (
        <RegisterLayout>
          <Register />
        </RegisterLayout>
      )
    }
  ])

  return routeElements
}
