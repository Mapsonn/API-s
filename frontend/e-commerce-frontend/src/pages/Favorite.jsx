import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { eliminarDeFavoritos } from '../store/favoritosSlice';

function Favorite() {
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.favoritos.items);
  const navigate = useNavigate();

  return (
    <div style={pageBackground}>
      <h1 style={titleStyle}>Mis Favoritos</h1>

      <div style={containerStyle}>
        {favoriteItems.length > 0 ? (
          <div style={gridContainer}>
            {favoriteItems.map((producto) => (
              <div key={producto.id} style={cardStyle}>
                <div style={imgContainer}>
                  <img
                    src={producto.imagenesUrl?.[0] ? `http://localhost:8080/imagenes/${producto.imagenesUrl[0]}` : 'https://placehold.co/300?text=ESTUDIO+40'}
                    alt={producto.nombre}
                    style={imgStyle}
                    onError={(e) => { e.target.src = 'https://placehold.co/300?text=ESTUDIO+40'; }}
                  />
                </div>

                <div style={infoStyle}>
                  <span style={catLabelStyle}>{producto.nombreCategoria || 'General'}</span>
                  <h3 style={productNameStyle}>{producto.nombre || 'Producto sin nombre'}</h3>
                  <p style={priceStyle}>${producto.precio || '0.00'}</p>
                </div>

                <div style={actionsStyle}>
                  <Link to={`/producto/${producto.id}`} style={btnDetalleStyle}>
                    <span style={btnTextStyle}>Ver detalle</span>
                  </Link>

                  <button onClick={() => dispatch(eliminarDeFavoritos(producto.id))} style={btnRemoveStyle}>
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={emptyStateStyle}>
            <Heart size={42} color="#c4a457" strokeWidth={1.5} />
            <p style={emptyTextStyle}>Todavía no agregaste productos favoritos.</p>
            <button onClick={() => navigate('/')} style={btnBackStyle}>
              <span style={btnTextStyle}>Ver productos</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const pageBackground = { padding: '80px 40px', minHeight: '100vh', backgroundColor: '#efefef' };
const titleStyle = { textAlign: 'center', fontSize: '3.5rem', marginBottom: '50px', color: '#251c18', fontFamily: "'Playfair Display', serif", fontWeight: '400' };
const containerStyle = { maxWidth: '1180px', margin: '0 auto' };
const gridContainer = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '34px' };
const cardStyle = { backgroundColor: '#f5f0e8', padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' };
const imgContainer = { width: '100%', height: '240px', overflow: 'hidden', borderRadius: '18px', marginBottom: '20px', backgroundColor: '#e8e2d9' };
const imgStyle = { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' };
const infoStyle = { textAlign: 'left', width: '100%' };
const catLabelStyle = { fontSize: '12px', color: '#c4a457', fontWeight: '600', textTransform: 'uppercase' };
const productNameStyle = { fontSize: '1.5rem', margin: '5px 0', color: '#251c18', fontWeight: '400', fontFamily: "'Playfair Display', serif" };
const priceStyle = { fontSize: '1.1rem', color: '#c9a84c', marginTop: '8px', fontWeight: '500', letterSpacing: '1px', fontFamily: "'Playfair Display', serif" };
const actionsStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', marginTop: '18px' };
const btnDetalleStyle = { display: 'inline-block', padding: '11px 24px', backgroundColor: '#251c18', color: '#f9f9f9', textDecoration: 'none', borderRadius: '4px', textAlign: 'center', flex: 1 };
const btnTextStyle = { fontFamily: "'Playfair Display', serif", fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '2px solid #c4a457', paddingBottom: '3px', display: 'inline-block' };
const btnRemoveStyle = { width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(37, 28, 24, 0.12)', backgroundColor: '#fff', color: '#b54a4a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const emptyStateStyle = { minHeight: '340px', backgroundColor: '#f5f0e8', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '40px', textAlign: 'center' };
const emptyTextStyle = { margin: 0, color: '#251c18', fontFamily: "'Playfair Display', serif", fontSize: '1.35rem' };
const btnBackStyle = { padding: '13px 34px', backgroundColor: '#251c18', color: '#f9f9f9', border: 'none', borderRadius: '4px', cursor: 'pointer' };

export default Favorite;
