import useElementsRoutes from './useElementsRoutes'

function App() {
  const routeElements = useElementsRoutes()
  return <div>{routeElements}</div>
}

export default App
