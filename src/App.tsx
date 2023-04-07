import useElementsRoutes from './useElementsRoutes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const routeElements = useElementsRoutes()
  return (
    <div>
      <ToastContainer />
      {routeElements}
    </div>
  )
}

export default App
