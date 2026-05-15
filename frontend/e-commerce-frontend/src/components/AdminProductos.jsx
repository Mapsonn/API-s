import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminProductos({ usuarioLogueado }) {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  const usuarioDeRespaldo = JSON.parse(localStorage.getItem("usuario"));
  const usuarioReal = usuarioLogueado || usuarioDeRespaldo;
  const esAdmin = usuarioReal?.role === 'ADMIN';

  useEffect(() => {
    if (!usuarioReal) {
      navigate('/login');
      return;
    }
    obtenerProductos();
  }, [usuarioLogueado, navigate]);

  const obtenerProductos = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/productos');
      const datos = Array.isArray(res.data) ? res.data : [];
      if (esAdmin) {
        setProductos(datos);
      } else {
        setProductos(datos.filter(p => p.usuarioId === usuarioReal?.id));
      }
    } catch (error) {
      console.error("Error al traer productos", error);
      setProductos([]);
    }
  };

  const eliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que querés eliminar este producto?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8080/api/productos/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setProductos(productos.filter(p => p.id !== id));
      } catch (err) {
        alert("No se pudo eliminar");
      }
    }
  };

  return (
    <div style={pageBackground}>
      <h1 style={titleStyle}>{esAdmin ? 'Panel de Administración' : 'Mis Productos'}</h1>

      <div style={containerStyle}>
        <div style={formStyle}>
          {productos.length > 0 ? (
            productos.map(p => (
              <div key={p.id} style={itemContainer}>
                <img
                  src={p.imagenesUrl?.[0] ? `http://localhost:8080/imagenes/${p.imagenesUrl[0]}` : 'https://placehold.co/100?text=ESTUDIO+40'}
                  alt={p.nombre}
                  style={miniImg}
                  onError={(e) => e.target.src = "https://placehold.co/100?text=ESTUDIO+40"}
                />

                <div style={infoWrapper}>
                  <h3 style={productNameStyle}>{p.nombre}</h3>
                  <p style={productPriceStyle}>${p.precio.toLocaleString()}</p>
                  <p style={productStockStyle}>Stock: {p.stock}</p>
                  {esAdmin && (
                    <p style={vendedorStyle}>
                      Vendedor: <strong>{p.nombreVendedor || 'Desconocido'}</strong>
                    </p>
                  )}
                </div>

                <div style={actionsWrapper}>
                  <button
                    onClick={() => navigate(`/editar-producto/${p.id}`)}
                    style={btnEditStyle}
                  >
                    <span style={btnTextInner}>Editar</span>
                  </button>

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
              {esAdmin ? 'No hay productos publicados todavía.' : 'No tienes productos publicados todavía.'}
            </p>
          )}

          {!esAdmin && (
            <button
              onClick={() => navigate('/crear-producto')}
              style={btnPublishStyle}
            >
              <span style={btnTextInner}>+ Publicar Nuevo Producto</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

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
  backgroundColor: '#f5f0e8',
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
  color: '#c9a84c',
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

const vendedorStyle = {
  margin: '6px 0 0 0',
  fontSize: '0.85rem',
  color: '#251c18',
  fontFamily: "'Playfair Display', serif",
  letterSpacing: '0.5px'
};

const actionsWrapper = { display: 'flex', flexDirection: 'column', gap: '10px' };

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
  borderBottom: '2px solid #c9a84c',
  paddingBottom: '3px'
};

const btnEditStyle = {
  ...baseBtn,
  backgroundColor: '#251c18',
  color: '#f9f9f9'
};

const btnDeleteStyle = {
  ...baseBtn,
  backgroundColor: '#b91c1c',
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
