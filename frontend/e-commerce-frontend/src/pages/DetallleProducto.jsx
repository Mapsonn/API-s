import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, ArrowLeft } from 'lucide-react';

function DetallleProducto({ agregarAlCarrito }) {
  const { id } = useParams();
  const [p, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/productos/${id}`)
      .then(res => setProducto(res.data))
      .catch(err => console.error("Error cargando producto:", err));
  }, [id]);

  const manejarClick = () => {
    if (p) {
      if (p.stock < cantidad) {
        alert("No hay suficiente stock disponible");
        return;
      }
      agregarAlCarrito({ ...p, cantidadElegida: cantidad });
      alert(`Agregaste ${cantidad} ${p.nombre} al carrito`);
      navigate('/carrito');
    }
  };

  if (!p) return <div style={loadingStyle}>Cargando archivo de diseño...</div>;

  return (
    <div style={pageBackground}>
      <div style={containerStyle}>
        
        {/* IMAGEN (Izquierda) */}
        <div style={imgSection}>
          <img 
            src={p.imagenesUrl?.[0] ? `http://localhost:8080/imagenes/${p.imagenesUrl[0]}` : 'https://placehold.co/600?text=ESTUDIO+40'}
            alt={p.nombre} 
            style={imgFit} 
            onError={(e) => { e.target.src = 'https://placehold.co/600?text=ESTUDIO+40' }}
          />
        </div>

        {/* INFO (Derecha) */}
        <div style={infoSection}>
          <span style={catLabelStyle}>
            {p.nombreCategoria || 'Colección Exclusiva'}
          </span>
          
          <h1 style={titleStyle}>{p.nombre}</h1>
          
          <p style={priceStyle}>${p.precio.toLocaleString()}</p>

          {/* --- BLOQUE: PUBLICADO POR --- */}
          <div style={authorSection}>
            <span style={authorLabel}>Publicado por: </span>
            <span style={authorName}>
              {p.nombreVendedor || 'Admin'}
            </span>
          </div>

          {/* --- BLOQUE DE DESCRIPCIÓN --- */}
          <div style={descriptionContainer}>
            <h3 style={descriptionTitle}>Descripción</h3>
            <p style={descriptionContent}>
              {p.descripcion || "Esta pieza de diseño exclusivo refleja la esencia de Estudio 40, combinando materiales premium con una estética atemporal."}
            </p>
          </div>

          <div style={divider}></div>

          {/* Selector de Cantidad */}
          <div style={quantitySection}>
            <label style={qtyLabel}>Cantidad</label>
            <div style={qtyControls}>
              <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} style={qtyBtn}>
                <Minus size={14}/>
              </button>
              <span style={qtyDisplay}>{cantidad}</span>
              <button onClick={() => setCantidad(cantidad + 1)} style={qtyBtn}>
                <Plus size={14}/>
              </button>
            </div>
          </div>

          <div style={buttonRow}>
            <button style={buyBtnStyle} onClick={manejarClick}>
              <span style={btnTextStyle}>Agregar al carrito</span>
            </button>
            
            <Link to="/" style={backLinkStyle}>
              <ArrowLeft size={16} /> Volver al catálogo
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- ESTILOS ACTUALIZADOS ---

const pageBackground = { 
  padding: '80px 40px', 
  minHeight: '100vh', 
  backgroundColor: '#f5f0e8', 
  display: 'flex', 
  justifyContent: 'center',
  alignItems: 'center'
};

const loadingStyle = { 
  textAlign: 'center', 
  padding: '100px', 
  fontFamily: "'Playfair Display', serif", 
  color: '#251c18',
  fontSize: '1.5rem'
};

const containerStyle = { 
  display: 'flex', 
  width: '100%', 
  maxWidth: '1200px', 
  gap: '80px', 
  alignItems: 'center' 
};

const imgSection = { 
  flex: '1.2', 
  backgroundColor: 'white', 
  borderRadius: '40px', 
  height: '650px', 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  boxShadow: '0 15px 40px rgba(37, 28, 24, 0.08)',
  overflow: 'hidden'
};

const imgFit = { width: '100%', height: '100%', objectFit: 'cover' };

const infoSection = { flex: '1', display: 'flex', flexDirection: 'column', textAlign: 'left' };

const catLabelStyle = { 
  fontSize: '0.9rem', 
  color: '#c9a84c', 
  fontWeight: '600', 
  letterSpacing: '2px', 
  textTransform: 'uppercase',
  marginBottom: '15px'
};

const titleStyle = { 
  fontFamily: "'Playfair Display', serif",
  fontSize: '4rem', 
  color: '#251c18', 
  margin: '0 0 20px 0', 
  fontWeight: '400', 
  lineHeight: '1' 
};

const priceStyle = { 
  fontFamily: "'Playfair Display', serif",
  fontSize: '2.5rem', 
  color: '#c9a84c', 
  margin: '0 0 10px 0', // Reducido para dar espacio al autor
  fontWeight: '400' 
};

// ESTILOS DEL AUTOR
const authorSection = {
  marginBottom: '25px',
  display: 'flex',
  alignItems: 'center',
  gap: '5px'
};

const authorLabel = {
  fontSize: '0.95rem',
  color: '#888',
  fontFamily: "'Playfair Display', serif",
  fontStyle: 'italic'
};

const authorName = {
  fontSize: '1rem',
  color: '#251c18',
  fontWeight: '600',
  fontFamily: "'Playfair Display', serif",
  borderBottom: '1px solid #c9a84c' // Línea dorada sutil
};

const descriptionContainer = {
  marginBottom: '30px',
  maxWidth: '90%'
};

const descriptionTitle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '0.9rem',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  color: '#c9a84c',
  marginBottom: '10px',
  fontWeight: '600'
};

const descriptionContent = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '1.1rem',
  lineHeight: '1.6',
  color: 'rgba(37, 28, 24, 0.8)',
  margin: 0,
  fontStyle: 'italic'
};

const divider = { height: '1px', backgroundColor: 'rgba(37, 28, 24, 0.1)', width: '100%', marginBottom: '35px' };

const quantitySection = { marginBottom: '45px' };
const qtyLabel = { display: 'block', fontSize: '0.85rem', color: '#251c18', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1.5px' };

const qtyControls = { 
  display: 'inline-flex', 
  alignItems: 'center', 
  border: '1.5px solid #251c18', 
  borderRadius: '4px',
  backgroundColor: 'white' 
};

const qtyBtn = { 
  padding: '12px 18px', 
  border: 'none', 
  backgroundColor: 'transparent', 
  cursor: 'pointer', 
  color: '#251c18',
  display: 'flex',
  alignItems: 'center',
  transition: '0.2s'
};

const qtyDisplay = { 
  padding: '0 25px', 
  fontSize: '1.2rem', 
  fontFamily: "'Playfair Display', serif",
  borderLeft: '1px solid rgba(37, 28, 24, 0.1)', 
  borderRight: '1px solid rgba(37, 28, 24, 0.1)' 
};

const buttonRow = { display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'flex-start' };

const buyBtnStyle = { 
  padding: '20px 50px', 
  backgroundColor: '#251c18', 
  color: '#f9f9f9', 
  border: 'none', 
  borderRadius: '4px',
  cursor: 'pointer',
  transition: '0.3s'
};

const btnTextStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '1.2rem',
  letterSpacing: '3px',
  textTransform: 'uppercase',
  borderBottom: '2px solid #c9a84c', 
  paddingBottom: '5px',
  display: 'inline-block'
};

const backLinkStyle = { 
  color: '#251c18', 
  textDecoration: 'none', 
  fontSize: '1rem', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '10px',
  opacity: 0.6,
  transition: '0.3s'
};

export default DetallleProducto;