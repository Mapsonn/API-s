import { Link, useNavigate } from 'react-router-dom';
// Importamos los iconos que necesitamos
import { Package, PlusCircle, User, LogOut, ShoppingCart } from 'lucide-react';

function Navbar({ cantidadCarrito, usuario }) {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    window.location.href = "/"; 
  };

  return (
    <nav style={navContainerStyle}>
      {/* 1. LOGO */}
      <div style={logoWrapperStyle} onClick={() => navigate('/')}>
        <img src="/image-removebg-preview.png" alt="Estudio 40" style={logoImgStyle} />
      </div>

      {/* 2. MENU CON ICONOS */}
      <div style={menuStyle}>
        
        {usuario ? (
          <>
            <Link to="/mis-productos" style={linkStyle}>
              <Package size={18} strokeWidth={1.5} /> Mis productos
            </Link>
            
            <Link to="/crear-producto" style={linkStyle}>
              <PlusCircle size={18} strokeWidth={1.5} /> Publicar
            </Link>
            
            <span style={welcomeStyle}>
              <User size={18} strokeWidth={1.5} color="#c4a457" />
              Hola, <strong style={userNameStyle}>{usuario.nombre}</strong>
            </span>
            
            <button onClick={cerrarSesion} style={logoutBtnStyle}>
              <LogOut size={16} strokeWidth={1.5} /> Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/registro" style={linkStyle}>Crear cuenta</Link>
            <Link to="/login" style={linkStyle}>Iniciar sesión</Link>
          </>
        )}

        {/* CARRITO RESALTADO */}
        <Link to="/carrito" style={cartLinkStyle}>
          <ShoppingCart size={20} strokeWidth={1.5} color="#c4a457" />
          Carrito {cantidadCarrito > 0 && <span style={cartCountStyle}>({cantidadCarrito})</span>}
        </Link>
      </div>
    </nav>
  );
}

// --- ESTILOS REFINADOS ---

const navContainerStyle = { 
  backgroundColor: '#251c18', 
  color: '#f9f9f9', 
  padding: '0.8rem 4rem', 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center',
  position: 'sticky', 
  top: 0, 
  zIndex: 1000,
  borderBottom: '1px solid rgba(249, 249, 249, 0.05)'
};

const logoWrapperStyle = { display: 'flex', alignItems: 'center', cursor: 'pointer' };
const logoImgStyle = { height: '45px', width: 'auto' };

const menuStyle = { display: 'flex', gap: '30px', alignItems: 'center' };

const linkStyle = { 
  color: '#f9f9f9', 
  textDecoration: 'none', 
  fontSize: '0.95rem',
  fontWeight: '400',
  display: 'flex', // Para alinear icono y texto
  alignItems: 'center',
  gap: '8px', // Espacio entre icono y texto
  transition: '0.3s',
  opacity: 0.85
};

const userNameStyle = { color: '#c4a457', fontWeight: '600' };

const welcomeStyle = { 
  fontSize: '0.95rem', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '8px',
  opacity: 0.9 
};

const cartLinkStyle = {
  ...linkStyle,
  opacity: 1,
  borderBottom: '1px solid #c4a457',
  paddingBottom: '2px'
};

const cartCountStyle = { color: '#c4a457', marginLeft: '4px' };

const logoutBtnStyle = {
  backgroundColor: 'transparent',
  color: '#f9f9f9',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.95rem',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  opacity: 0.6,
  padding: 0
};

export default Navbar;