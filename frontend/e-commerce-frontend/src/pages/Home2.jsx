import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

function Home2() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  const fetchProductos = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/productos');
      setProductos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setProductos([]);
    }
  }, []);

  useEffect(() => {
    const fetchInicial = async () => {
      setCargando(true);
      await fetchProductos();
      try {
        const resCat = await axios.get('http://localhost:8080/api/categorias');
        setCategorias(Array.isArray(resCat.data) ? resCat.data : []);
      } catch (err) {
        console.error("Error cargando categorías:", err);
        setCategorias([]);
      }
      setCargando(false);
    };
    fetchInicial();
  }, [fetchProductos]);

  const filtrarPorCategoria = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/productos/categoria/${id}`);
      setProductos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error al filtrar por categoría:", err);
    }
  };

  const scrollToProductos = () => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const usuarioActual = JSON.parse(localStorage.getItem("usuario") || "null");

  const productosFiltrados = (productos || []).filter(p =>
    p?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) &&
    (!usuarioActual || p.usuarioId !== usuarioActual.id)
  );

  // Toma las primeras 3 fotos reales del catálogo para el hero
  const fotosHero = productos.slice(0, 3);

  const getImgSrc = (p) =>
    p?.imagenesUrl?.[0]
      ? `http://localhost:8080/imagenes/${p.imagenesUrl[0]}`
      : 'https://placehold.co/300x400?text=E40';

  return (
    <div>

      {/* ── HERO SECTION ── */}
      <section style={heroStyle}>
        <div style={heroBgPattern}></div>
        <div style={heroGlow}></div>
        <div style={heroGlow2}></div>

        <div style={heroContent}>
          <p style={heroEyebrow}>ESTUDIO-40 · Argentina</p>
          <h1 style={heroTitle}>
            Comprá y vendé<br />
            moda con <em style={heroTitleEm}>estilo.</em>
          </h1>
          <p style={heroSubtitle}>
            Miles de prendas publicadas por vendedores reales. Encontrá lo que buscás o publicá lo tuyo en minutos.
          </p>
          <div style={heroActions}>
            <button onClick={scrollToProductos} style={heroBtnPrimary}>
              Ver productos
            </button>
           <button onClick={() => {
              const usuario = localStorage.getItem('usuario');
              navigate(usuario ? '/crear-producto' : '/login');
            }} style={heroBtnSecondary}>
              Publicar ahora
            </button>
          </div>
          <div style={heroStats}>
            <div>
              <div style={heroStatNum}>{productos.length > 0 ? `${productos.length}+` : '500+'}</div>
              <div style={heroStatLabel}>Publicaciones</div>
            </div>
            <div>
              <div style={heroStatNum}>{categorias.length > 0 ? categorias.length : '12'}</div>
              <div style={heroStatLabel}>Categorías</div>
            </div>
            <div>
              <div style={heroStatNum}>100%</div>
              <div style={heroStatLabel}>Vendedores reales</div>
            </div>
          </div>
        </div>

        {/* COLLAGE EDITORIAL */}
        <div style={heroVisual}>
          <div style={collageWrapper}>

            {fotosHero[0] && (
              <div style={card1Style}>
                <div style={cardInner}>
                  <img
                    src={getImgSrc(fotosHero[0])}
                    alt={fotosHero[0].nombre}
                    style={cardImgStyle}
                  />
                  <div style={cardLabel}>
                    <span style={cardCat}>{fotosHero[0].nombreCategoria}</span>
                    <span style={cardName}>{fotosHero[0].nombre}</span>
                  </div>
                </div>
              </div>
            )}

            {fotosHero[1] && (
              <div style={card2Style}>
                <div style={cardInner}>
                  <img
                    src={getImgSrc(fotosHero[1])}
                    alt={fotosHero[1].nombre}
                    style={cardImgStyle}
                  />
                  <div style={cardLabel}>
                    <span style={cardCat}>{fotosHero[1].nombreCategoria}</span>
                    <span style={cardName}>{fotosHero[1].nombre}</span>
                  </div>
                </div>
              </div>
            )}

            {fotosHero[2] && (
              <div style={card3Style}>
                <div style={cardInner}>
                  <img
                    src={getImgSrc(fotosHero[2])}
                    alt={fotosHero[2].nombre}
                    style={cardImgStyle}
                  />
                  <div style={cardLabel}>
                    <span style={cardCat}>{fotosHero[2].nombreCategoria}</span>
                    <span style={cardName}>{fotosHero[2].nombre}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </section>

      {/* ── CATÁLOGO ── */}
      <div id="catalogo" style={mainLayout}>

        <aside style={sidebarStyle}>
          <h3 style={sidebarTitleStyle}>Categorías</h3>
          <button onClick={fetchProductos} style={catButtonStyle}>
            <span style={underlinedTextStyle}>Ver Todos</span>
          </button>
          {categorias.map(cat => (
            <button key={cat.id} onClick={() => filtrarPorCategoria(cat.id)} style={catButtonStyle}>
              <span style={underlinedTextStyle}>{cat.nombreCategoria || cat.nombre}</span>
            </button>
          ))}
        </aside>

        <main style={{ flex: 1, padding: '20px' }}>
          <div style={headerContainer}>
            <div style={{ flex: 1 }}></div>
            <div style={{ flex: 2, textAlign: 'center' }}>
              <h1 style={titleStyle}>Productos</h1>
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <div style={searchWrapper}>
                <Search size={18} color="#c4a457" style={searchIconStyle} />
                <input
                  type="text"
                  placeholder="Buscar"
                  style={searchInputStyle}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
          </div>

          {cargando ? (
            <div style={{ textAlign: 'center', fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>
              Cargando catálogo de Estudio 40...
            </div>
          ) : (
            <div style={gridContainer}>
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map(p => (
                  <div key={p.id} style={cardStyle}>
                    <div style={imgContainer}>
                      <img
                        src={p.imagenesUrl?.[0] ? `http://localhost:8080/imagenes/${p.imagenesUrl[0]}` : 'https://placehold.co/300?text=SIN+IMAGEN'}
                        alt={p.nombre}
                        style={imgStyle}
                        onError={(e) => { e.target.src = 'https://placehold.co/300?text=ESTUDIO+40'; }}
                      />
                    </div>
                    <div style={{ textAlign: 'left', width: '100%', paddingLeft: '10px' }}>
                      <span style={catLabelStyle}>{p.nombreCategoria || 'General'}</span>
                      <h3 style={productNameStyle}>{p.nombre || 'Producto sin nombre'}</h3>
                      <p style={priceStyle}>${p.precio || '0.00'}</p>
                      <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Link to={`/producto/${p.id}`} style={btnDetalleStyle}>
                          <span style={btnTextStyle}>Ver detalle</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
                  No se encontraron productos en esta sección.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ── HERO STYLES ──
const heroStyle = { width: '100%', minHeight: '520px', backgroundColor: '#1a1410', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' };
const heroBgPattern = { position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(196,164,87,0.04) 60px, rgba(196,164,87,0.04) 61px)' };
const heroGlow = { position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,164,87,0.09) 0%, transparent 70%)', top: '-120px', right: 0, pointerEvents: 'none' };
const heroGlow2 = { position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,164,87,0.06) 0%, transparent 70%)', bottom: '-80px', left: '100px', pointerEvents: 'none' };
const heroContent = { position: 'relative', zIndex: 2, padding: '60px 50px', maxWidth: '50%' };
const heroEyebrow = { fontFamily: "'Playfair Display', serif", fontSize: '12px', fontWeight: '400', letterSpacing: '4px', textTransform: 'uppercase', color: '#c4a457', marginBottom: '18px' };
const heroTitle = { fontFamily: "'Playfair Display', serif", fontSize: '58px', fontWeight: '400', lineHeight: '1.1', color: '#f5f0e8', marginBottom: '22px' };
const heroTitleEm = { fontStyle: 'italic', color: '#c4a457' };
const heroSubtitle = { fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: '300', color: 'rgba(245,240,232,0.58)', lineHeight: '1.75', marginBottom: '38px', maxWidth: '380px' };
const heroActions = { display: 'flex', alignItems: 'center', gap: '22px' };
const heroBtnPrimary = { backgroundColor: '#c4a457', color: '#1a1410', border: 'none', padding: '13px 34px', fontFamily: "'Playfair Display', serif", fontSize: '13px', fontWeight: '700', letterSpacing: '2.5px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' };
const heroBtnSecondary = { background: 'none', border: 'none', color: 'rgba(245,240,232,0.6)', fontFamily: "'Playfair Display', serif", fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '1px solid rgba(196,164,87,0.4)', paddingBottom: '2px', cursor: 'pointer' };
const heroStats = { display: 'flex', gap: '28px', marginTop: '44px', paddingTop: '28px', borderTop: '1px solid rgba(196,164,87,0.14)' };
const heroStatNum = { fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: '700', color: '#c4a457', lineHeight: '1' };
const heroStatLabel = { fontFamily: "'Playfair Display', serif", fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)', marginTop: '4px' };

// Collage
const heroVisual = { position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const collageWrapper = { position: 'relative', width: '380px', height: '460px' };

const baseCard = { position: 'absolute', overflow: 'hidden', borderRadius: '3px', boxShadow: '0 16px 50px rgba(0,0,0,0.6)', border: '1px solid rgba(196,164,87,0.18)' };
const card1Style = { ...baseCard, width: '190px', height: '260px', top: 0, left: 0, transform: 'rotate(-5deg)', zIndex: 1 };
const card2Style = { ...baseCard, width: '210px', height: '280px', top: '20px', left: '140px', transform: 'rotate(3deg)', zIndex: 3 };
const card3Style = { ...baseCard, width: '230px', height: '175px', bottom: 0, left: '40px', transform: 'rotate(2deg)', zIndex: 4 };

const cardInner = { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' };
const cardImgStyle = { width: '100%', flex: 1, objectFit: 'cover', display: 'block' };
const cardLabel = { padding: '8px 12px', backgroundColor: 'rgba(26,20,16,0.88)', display: 'flex', flexDirection: 'column', gap: '2px' };
const cardCat = { fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#c4a457' };
const cardName = { fontFamily: "'Playfair Display', serif", fontSize: '13px', color: '#f5f0e8', fontWeight: '400' };

const heroScrollHint = { position: 'absolute', bottom: '22px', left: '60px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 5 };
const heroScrollLine = { width: '36px', height: '1px', backgroundColor: 'rgba(196,164,87,0.45)' };
const heroScrollText = { fontFamily: "'Playfair Display', serif", fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(245,240,232,0.28)' };

// ── ESTILOS CATÁLOGO ──
const mainLayout = { display: 'flex', padding: '40px', gap: '40px', minHeight: '100vh', backgroundColor: '#efefef' };
const sidebarStyle = { width: '240px', borderRight: '1px solid rgba(37, 28, 24, 0.1)', paddingRight: '20px' };
const sidebarTitleStyle = { fontFamily: "'Playfair Display', serif", color: '#251c18', marginBottom: '30px', fontSize: '1.8rem', fontWeight: '400' };
const catButtonStyle = { display: 'block', width: '100%', padding: '12px', marginBottom: '12px', border: 'none', backgroundColor: '#251c18', color: '#f9f9f9', borderRadius: '15px', cursor: 'pointer', textAlign: 'center', fontSize: '1rem', transition: '0.3s' };
const underlinedTextStyle = { borderBottom: '2px solid #c4a457', paddingBottom: '2px', fontFamily: "'Playfair Display', serif" };
const headerContainer = { display: 'flex', alignItems: 'center', marginBottom: '60px', width: '100%' };
const titleStyle = { fontSize: '3.5rem', margin: 0, color: '#251c18', fontWeight: '400', fontFamily: "'Playfair Display', serif" };
const searchWrapper = { position: 'relative', display: 'flex', alignItems: 'center' };
const searchIconStyle = { position: 'absolute', left: '15px' };
const searchInputStyle = { padding: '10px 15px 10px 45px', borderRadius: '40px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', color: '#251c18', width: '220px', outline: 'none', fontSize: '0.9rem' };
const gridContainer = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' };
const cardStyle = { backgroundColor: '#f5f0e8', padding: '25px', borderRadius: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' };
const imgContainer = { width: '100%', height: '240px', overflow: 'hidden', borderRadius: '25px',marginBottom: '20px',backgroundColor: '#e8e2d9'};
const imgStyle = { width: '100%', height: '100%', objectFit: 'cover',objectPosition: 'center top', display: 'block'};
const catLabelStyle = { fontSize: '12px', color: '#c4a457', fontWeight: '600', textTransform: 'uppercase' };
const productNameStyle = { fontSize: '1.6rem', margin: '5px 0', color: '#251c18', fontWeight: '400', fontFamily: "'Playfair Display', serif" };
const priceStyle = { fontSize: '1.1rem', color: '#c9a84c', marginTop: '8px', fontWeight: '500', letterSpacing: '1px', fontFamily: "'Playfair Display', serif" };
const btnDetalleStyle = { display: 'inline-block', padding: '12px 30px', backgroundColor: '#251c18', color: '#f9f9f9', textDecoration: 'none', borderRadius: '4px', transition: '0.3s', textAlign: 'center' };
const btnTextStyle = { fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '2px solid #c4a457', paddingBottom: '3px', display: 'inline-block' };

export default Home2;