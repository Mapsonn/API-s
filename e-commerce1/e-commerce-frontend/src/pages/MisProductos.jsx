import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MisProductos({ usuarioLogueado }) {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioDeRespaldo = JSON.parse(localStorage.getItem("usuario"));
    const usuarioReal = usuarioLogueado || usuarioDeRespaldo;

    if (!usuarioReal) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:8080/api/productos')
      .then(res => {
        // Filtramos para que el admin solo vea SUS prendas
        const misPublis = res.data.filter(p => p.usuario?.id === usuarioReal.id);
        setProductos(misPublis);
      })
      .catch(err => console.error("Error cargando productos:", err));
  }, [usuarioLogueado, navigate]);

  const eliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que querés eliminar esta publicación?")) {
      try {
        await axios.delete(`http://localhost:8080/api/productos/${id}`);
        setProductos(productos.filter(p => p.id !== id));
      } catch (err) {
        alert("No se pudo eliminar el producto.");
      }
    }
  };

  return (
    <div style={pageBackground}>
      <h1 style={titleStyle}>Mis Publicaciones</h1>
      
      <div style={containerStyle}>
        <div style={formStyle}>
          {productos.length > 0 ? (
            productos.map(p => (
              <div key={p.id} style={itemContainer}>
                {/* Miniatura a la izquierda */}
                <img 
                  src={`http://localhost:8080/uploads/${p.imagenUrl}`} 
                  alt={p.nombre} 
                  style={miniImg} 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=ESTUDIO+40' }}
                />
                
                <div style={infoWrapper}>
                  <h3 style={productName}>{p.nombre}</h3>
                  {/* Precio Dorado y Serif */}
                  <p style={productPrice}>${p.precio.toLocaleString()}</p>
                  <p style={productStock}>Stock disponible: {p.stock}</p>
                </div>

                <div style={actionsWrapper}>
                  {/* Botón Editar - Marrón Estudio 40 */}
                  <button 
                    onClick={() => navigate(`/editar-producto/${p.id}`)} 
                    style={btnEdit}
                  >
                    <span style={btnTextInner}>Editar</span>
                  </button>

                  {/* Botón Eliminar - Rojo con línea dorada */}
                  <button 
                    onClick={() => eliminar(p.id)} 
                    style={btnDeleteStyle}
                  >
                    <span style={btnTextInner}>Eliminar</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={noProductsText}>
              No tienes piezas publicadas en tu archivo todavía.
            </p>
          )}

          {/* Botón Principal de Publicar */}
          <button 
            onClick={() => navigate('/crear-producto')} 
            style={btnPublishStyle}
          >
            <span style={btnTextInner}>+ Publicar Nueva Pieza</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// --- ESTILOS "ESTUDIO 40" DEFINITIVOS ---

const pageBackground = { 
  padding: '80px 0', 
  minHeight: '100vh', 
  backgroundColor: '#efefef' 
};

const titleStyle = { 
  textAlign: 'center', 
  fontSize: '3.5rem', 
  marginBottom: '50px', 
  color: '#251c18', 
  fontFamily: "'Playfair Display', serif",
  fontWeight: '400' 
};

const containerStyle = { 
  maxWidth: '850px', 
  margin: '0 auto', 
  padding: '40px', 
  backgroundColor: '#f5f0e8', // Fondo crema vintage
  borderRadius: '40px', // Tus 40px
  boxShadow: '0 15px 35px rgba(37, 28, 24, 0.08)' 
};

const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };

const itemContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '25px',
  padding: '20px',
  backgroundColor: 'white',
  borderRadius: '20px',
  border: '1px solid rgba(37, 28, 24, 0.05)'
};

const miniImg = { 
  width: '110px', 
  height: '110px', 
  borderRadius: '10px', 
  objectFit: 'cover',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
};

const infoWrapper = { flex: 1 };

const productName = { 
  margin: 0, 
  fontSize: '1.5rem', 
  color: '#251c18',
  fontFamily: "'Playfair Display', serif",
  fontWeight: '400'
};

const productPrice = { 
  margin: '8px 0', 
  fontSize: '1.2rem',
  color: '#c9a84c', // Dorado precio
  fontFamily: "'Playfair Display', serif",
  fontWeight: '600'
};

const productStock = { 
  margin: 0, 
  fontSize: '0.8rem', 
  color: '#888', 
  textTransform: 'uppercase', 
  letterSpacing: '1.5px' 
};

const actionsWrapper = { display: 'flex', flexDirection: 'column', gap: '10px' };

const baseBtn = {
  padding: '12px 25px',
  border: 'none',
  borderRadius: '4px', // Radius pedido de 4px
  cursor: 'pointer',
  transition: '0.3s',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: '120px'
};

const btnTextInner = {
  fontFamily: "'Playfair Display', serif",
  textTransform: 'uppercase',
  fontSize: '0.85rem',
  letterSpacing: '2px',
  borderBottom: '2px solid #c9a84c', // Línea dorada interna
  paddingBottom: '3px'
};

const btnEdit = {
  ...baseBtn,
  backgroundColor: '#251c18',
  color: '#f9f9f9'
};

const btnDeleteStyle = {
  ...baseBtn,
  backgroundColor: '#b91c1c', // Rojo oscuro elegante
  color: 'white'
};

const btnPublishStyle = {
  ...baseBtn,
  marginTop: '30px',
  backgroundColor: '#251c18',
  color: '#f9f9f9',
  padding: '20px'
};

const noProductsText = { 
  textAlign: 'center', 
  color: '#251c18', 
  padding: '40px', 
  fontFamily: "'Playfair Display', serif",
  fontSize: '1.2rem',
  opacity: 0.6
};

export default MisProductos;