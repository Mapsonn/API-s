import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import { fetchCarrito } from './store/carritoSlice'
import Navbar from './components/navbar'
import Home2 from './pages/Home2'
import Carrito from './pages/Carrito'
import LoginJWT from './pages/LoginJWT'
import Registro from './pages/Registro'
import DetallleProducto from './pages/DetallleProducto'
import Favorite from './pages/Favorite'
import CrearProducto from './components/CrearProducto'
import AdminProductos from './components/AdminProductos'
import EditarProducto from './components/EditarProducto'
import Perfil from './pages/Perfil'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const dispatch = useDispatch()
  const usuario = useSelector((state) => state.auth.usuario)
  const theme = useSelector((state) => state.ui.theme)

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [theme])

  useEffect(() => {
    if (usuario?.id) {
      dispatch(fetchCarrito(usuario.id))
    }
  }, [usuario?.id, dispatch])

  return (
    <div style={{ backgroundColor: '#efefef', minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
      <Navbar />

      <main style={{ width: '100%' }}>
        <Routes>
          <Route path="/" element={<Home2 />} />
          <Route path="/producto/:id" element={<DetallleProducto />} />
          <Route path="/carrito" element={<Carrito />} />

          <Route
            path="/favoritos"
            element={
              <ProtectedRoute>
                <Favorite />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mis-productos"
            element={
              <ProtectedRoute>
                <AdminProductos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/crear-producto"
            element={
              <ProtectedRoute>
                <CrearProducto />
              </ProtectedRoute>
            }
          />

          <Route
            path="/editar-producto/:id"
            element={
              <ProtectedRoute>
                <EditarProducto />
              </ProtectedRoute>
            }
          />

          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />

          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<LoginJWT />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;
