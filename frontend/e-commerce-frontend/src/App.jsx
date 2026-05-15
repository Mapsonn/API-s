import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar'
import Home2 from './pages/Home2'
import Carrito from './pages/Carrito'
import Login from './pages/Login'
import Registro from './pages/Registro' 
import DetallleProducto from './pages/DetallleProducto' 
import CrearProducto from './components/CrearProducto'
import AdminProductos from './components/AdminProductos'; 
import EditarProducto from './components/EditarProducto'; // 1. Importación agregada
import Perfil from './pages/Perfil';

function App() {
  const [carrito, setCarrito] = useState([])
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    const guardado = localStorage.getItem("usuario");
    return guardado ? JSON.parse(guardado) : null;
  });

  const agregarAlCarrito = (producto) => {
    if (producto.stock <= 0) {
      alert("Lo sentimos, este producto no tiene stock disponible.");
      return;
    }
    setCarrito((prevCarrito) => [...prevCarrito, producto]);
  }

  const eliminarDelCarrito = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1); 
    setCarrito(nuevoCarrito);
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    // 2. Fondo unificado y ancho total
    <div style={{ backgroundColor: '#efefef', minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
      
      <Navbar cantidadCarrito={carrito.length} usuario={usuarioLogueado} />
      
      {/* Contenedor principal sin restricciones de ancho para que las páginas respiren */}
      <main style={{ width: '100%' }}>
        <Routes>
          <Route path="/" element={<Home2 agregarAlCarrito={agregarAlCarrito} />} />
          
          <Route path="/producto/:id" element={<DetallleProducto agregarAlCarrito={agregarAlCarrito} />} />
          
          <Route 
            path="/carrito" 
            element={
              <Carrito 
                items={carrito} 
                eliminarDelCarrito={eliminarDelCarrito} 
                vaciarCarrito={vaciarCarrito} 
                usuarioLogueado={usuarioLogueado}
              />
            } 
          />
          
          <Route 
            path="/mis-productos" 
            element={<AdminProductos usuarioLogueado={usuarioLogueado} />} 
          />
          
          <Route 
            path="/crear-producto" 
            element={<CrearProducto usuarioLogueado={usuarioLogueado} />} 
          />

          {/* 3. RUTA DE EDICIÓN AGREGADA CON PARÁMETRO :ID */}
          <Route 
            path="/editar-producto/:id" 
            element={<EditarProducto usuarioLogueado={usuarioLogueado} />} 
          />

          <Route path="/perfil" element={<Perfil />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login setUsuarioLogueado={setUsuarioLogueado} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;