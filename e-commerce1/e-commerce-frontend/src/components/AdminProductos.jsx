import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminProductos({ usuarioLogueado }) {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioDeRespaldo = JSON.parse(localStorage.getItem("usuario"));
    const usuarioReal = usuarioLogueado || usuarioDeRespaldo;

    if (!usuarioReal) {
      navigate('/login');
      return;
    }

    obtenerMisProductos(usuarioReal.id);
  }, [usuarioLogueado, navigate]);

 const obtenerMisProductos = async () => {
    try {
        const res = await axios.get('http://localhost:8080/api/productos');
        // VALIDACIÓN CLAVE: Si no es array, ponemos lista vacía
        const datos = Array.isArray(res.data) ? res.data : [];
        setProductos(datos); 
    } catch (error) {
        console.error("Error al traer productos", error);
        setProductos([]); // Evita que quede como undefined
    }
};

  const eliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que querés eliminar este producto?")) {
      try {
        await axios.delete(`http://localhost:8080/api/productos/${id}`);
        setProductos(productos.filter(p => p.id !== id));
      } catch (err) {
        alert("No se pudo eliminar");
      }
    }
  };

  return (
    <div style={pageBackground}>
      <h1 style={titleStyle}>Mis Productos</h1>
      
      <div style={containerStyle}>
        <div style={formStyle}>
          {productos.length > 0 ? (
            productos.map(p => (
              <div key={p.id} style={itemContainer}>
                {/* Miniatura con la ruta corregida a la API */}
                <img 
                  src={`http://localhost:8080/imagenes/${p.imagenUrl}`}
                  alt={p.nombre} 
                  style={miniImg} 
                  onError={(e) => e.target.src = "https://via.placeholder.com/100?text=ESTUDIO+40"}
                />
                
                <div style={infoWrapper}>
                  <h3 style={productNameStyle}>{p.nombre}</h3>
                  <p style={productPriceStyle}>${p.precio.toLocaleString()}</p>
                  <p style={productStockStyle}>Stock: {p.stock}</p>
                </div>

                <div style={actionsWrapper}>
                  {/* Botón Editar - Marrón con línea dorada */}
                  <button 
                    onClick={() => navigate(`/editar-producto/${p.id}`)} 
                    style={btnEditStyle}
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
            <p style={noProductsText}>No tienes productos publicados todavía.</p>
          )}
          
          {/* Botón Publicar - Estilo Bloque Marrón */}
          <button 
            onClick={() => navigate('/crear-producto')} 
            style={btnPublishStyle}
          >
            <span style={btnTextInner}>+ Publicar Nuevo Producto</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// --- ESTILOS REFINADOS ESTUDIO 40 ---

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
  backgroundColor: '#f5f0e8', // Crema Vintage
  borderRadius: '40px', 
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
  width: '100px', 
  height: '100px', 
  borderRadius: '8px', 
  objectFit: 'cover' 
};

const infoWrapper = { flex: 1 };

const productNameStyle = { 
  margin: 0, 
  fontSize: '1.4rem', 
  color: '#251c18',
  fontFamily: "'Playfair Display', serif",
  fontWeight: '400'
};

const productPriceStyle = { 
  margin: '5px 0', 
  fontSize: '1.1rem',
  color: '#c9a84c', // Dorado Estudio 40
  fontFamily: "'Playfair Display', serif",
  fontWeight: '600'
};

const productStockStyle = { 
  margin: 0, 
  fontSize: '0.8rem', 
  color: '#888', 
  textTransform: 'uppercase', 
  letterSpacing: '1px' 
};

const actionsWrapper = { display: 'flex', flexDirection: 'column', gap: '10px' };

// BASE DE BOTONES (4px radius)
const baseBtn = {
  padding: '12px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: '0.3s',
  minWidth: '130px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const btnTextInner = {
  fontFamily: "'Playfair Display', serif",
  textTransform: 'uppercase',
  fontSize: '0.85rem',
  letterSpacing: '2px',
  borderBottom: '2px solid #c9a84c', // Línea dorada interna
  paddingBottom: '3px'
};

const btnEditStyle = {
  ...baseBtn,
  backgroundColor: '#251c18',
  color: '#f9f9f9'
};

const btnDeleteStyle = {
  ...baseBtn,
  backgroundColor: '#b91c1c', // Rojo elegante
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
  opacity: 0.6
};

export default AdminProductos;