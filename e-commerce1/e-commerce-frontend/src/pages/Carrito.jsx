import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Minus, Trash2 } from 'lucide-react';

// Agregamos usuarioLogueado a las props
function Carrito({ items, eliminarDelCarrito, vaciarCarrito, usuarioLogueado }) {
  const navigate = useNavigate();

  const total = items.reduce((acc, item) => acc + (item.precio * (item.cantidadElegida || 1)), 0);

  const finalizarCompra = async () => {
    if (items.length === 0) return;

    // VALIDACIÓN: Si no hay usuario, no permite avanzar
    if (!usuarioLogueado) {
      alert("Debes iniciar sesión para realizar la compra.");
      navigate('/login');
      return;
    }

    try {
      const datosEnvio = items.map(item => ({
        id: item.id,
        cantidad: item.cantidadElegida || 1 
      }));

      await axios.post('http://localhost:8080/api/productos/checkout', datosEnvio);
      
      alert("¡Compra realizada con éxito! Tu orden ha sido archivada.");
      vaciarCarrito();
      navigate('/');
    } catch (error) {
      console.error("Error en el checkout:", error);
      const mensajeError = error.response?.data || "Error al procesar la compra. Verifica el stock.";
      alert(mensajeError);
    }
  };

  return (
    <div style={pageBackground}>
      <h1 style={titleStyle}>Tu Carrito</h1>
      
      <div style={containerStyle}>
        <div style={formStyle}>
          {items.length > 0 ? (
            <>
              {items.map((item, index) => (
                <div key={index} style={itemContainer}>
                  <img 
                    src={`http://localhost:8080/imagenes/${item.imagenUrl}`} 
                    alt={item.nombre} 
                    style={miniImg} 
                    onError={(e) => e.target.src = "https://via.placeholder.com/100?text=ESTUDIO+40"}
                  />
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={productName}>{item.nombre}</h3>
                    <p style={productPrice}>${item.precio.toLocaleString()}</p>
                    
                    <div style={qtyWrapper}>
                        <span style={qtyLabel}>Piezas: {item.cantidadElegida || 1}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => eliminarDelCarrito(index)} 
                    style={btnDeleteStyle}
                  >
                    <span style={btnTextInnerSmall}>Quitar</span>
                  </button>
                </div>
              ))}

              <div style={totalContainer}>
                <span style={totalLabel}>Valor Total del Carrito</span>
                <h2 style={totalAmount}>${total.toLocaleString()}</h2>
              </div>

              {/* LÓGICA DE BOTÓN: Cambia el texto si no está logueado */}
              <button onClick={finalizarCompra} style={btnFinalizarStyle}>
                <span style={btnTextInner}>
                  {usuarioLogueado ? "Finalizar Compra" : "Iniciá sesión para comprar"}
                </span>
              </button>
              
              <button 
                onClick={vaciarCarrito} 
                style={btnVaciarStyle}
              >
                <span style={btnTextInnerRed}>Vaciar Carrito</span>
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={emptyText}>Tu carrito está vacío.</p>
              <button onClick={() => navigate('/')} style={btnFinalizarStyle}>
                <span style={btnTextInner}>Volver a la Tienda</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- ESTILOS "ESTUDIO 40" CARRITO ---
const pageBackground = { padding: '80px 0', minHeight: '100vh', backgroundColor: '#f5f0e8' };
const titleStyle = { textAlign: 'center', fontSize: '3.5rem', marginBottom: '50px', color: '#251c18', fontFamily: "'Playfair Display', serif", fontWeight: '400' };
const containerStyle = { maxWidth: '800px', margin: '0 auto', padding: '40px', backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 10px 30px rgba(37, 28, 24, 0.05)' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const itemContainer = { display: 'flex', alignItems: 'center', gap: '25px', padding: '20px', backgroundColor: '#f5f0e8', borderRadius: '4px', border: '1px solid rgba(37, 28, 24, 0.05)' };
const miniImg = { width: '100px', height: '100px', borderRadius: '2px', objectFit: 'cover' };
const productName = { margin: 0, fontSize: '1.4rem', color: '#251c18', fontFamily: "'Playfair Display', serif", fontWeight: '400' };
const productPrice = { margin: '5px 0', color: '#c9a84c', fontSize: '1.2rem', fontFamily: "'Playfair Display', serif" };
const qtyWrapper = { display: 'flex', alignItems: 'center', marginTop: '10px' };
const qtyLabel = { fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#666' };
const totalContainer = { marginTop: '20px', padding: '30px 0', borderTop: '1px solid rgba(37, 28, 24, 0.1)', textAlign: 'right', display: 'flex', flexDirection: 'column' };
const totalLabel = { fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#251c18', fontFamily: "'Playfair Display', serif" };
const totalAmount = { fontSize: '3rem', color: '#c9a84c', margin: '5px 0 0 0', fontFamily: "'Playfair Display', serif", fontWeight: '400' };
const baseBtn = { padding: '18px', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: '0.3s', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const btnFinalizarStyle = { ...baseBtn, backgroundColor: '#251c18', color: '#f9f9f9' };
const btnVaciarStyle = { ...baseBtn, backgroundColor: 'transparent', border: '1px solid #c0392b', color: '#c0392b', marginTop: '10px' };
const btnDeleteStyle = { padding: '10px 20px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const btnTextInner = { fontFamily: "'Playfair Display', serif", textTransform: 'uppercase', fontSize: '1.1rem', letterSpacing: '3px', borderBottom: '2px solid #c9a84c', paddingBottom: '3px' };
const btnTextInnerSmall = { ...btnTextInner, fontSize: '0.8rem', letterSpacing: '1px', borderBottom: '1px solid #c9a84c' };
const btnTextInnerRed = { ...btnTextInner, borderBottom: '2px solid #c0392b' };
const emptyText = { fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#251c18', marginBottom: '30px' };

export default Carrito;