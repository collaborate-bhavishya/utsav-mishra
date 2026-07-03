import UtsavHome from './UtsavHome'
import AdminApp from './admin/AdminApp'

function App() {
  if (window.location.pathname.startsWith('/admin')) {
    return <AdminApp />
  }
  return <UtsavHome />
}

export default App
