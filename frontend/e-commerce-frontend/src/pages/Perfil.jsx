import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (!guardado) {
      navigate('/login');
      return;
    }
    setUsuario(JSON.parse(guardado));
  }, [navigate]);

  if (!usuario) return null;

  return (
    <div style={pageBackground}>
      <h1 style={titleStyle}>Mi Perfil</h1>

      <div style={containerStyle}>

        <div style={avatarCircle}>
          <span style={avatarLetter}>
            {usuario.nombre?.charAt(0).toUpperCase()}
          </span>
        </div>

        <div style={infoGrid}>
          <Campo label="Nombre" valor={usuario.nombre} />
          <Campo label="Apellido" valor={usuario.apellido} />
          <Campo label="Email" valor={usuario.email} />
          <Campo label="Rol" valor={usuario.role === 'ADMIN' ? 'Administrador' : 'Usuario'} />
        </div>

        <button onClick={() => navigate('/')} style={btnStyle}>
          <span style={btnText}>Volver a la tienda</span>
        </button>
      </div>
    </div>
  );
}

function Campo({ label, valor }) {
  return (
    <div style={campoWrapper}>
      <span style={campoLabel}>{label}</span>
      <span style={campoValor}>{valor || '-'}</span>
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
  maxWidth: '600px',
  margin: '0 auto',
  padding: '50px 40px',
  backgroundColor: '#f5f0e8',
  borderRadius: '40px',
  boxShadow: '0 15px 35px rgba(37, 28, 24, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '40px'
};

const avatarCircle = {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  backgroundColor: '#251c18',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '3px solid #c4a457'
};

const avatarLetter = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '3rem',
  color: '#c4a457',
  fontWeight: '400'
};

const infoGrid = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0'
};

const campoWrapper = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '18px 0',
  borderBottom: '1px solid rgba(37, 28, 24, 0.1)'
};

const campoLabel = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  color: '#c4a457'
};

const campoValor = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '1.1rem',
  color: '#251c18',
  fontWeight: '400'
};

const btnStyle = {
  padding: '15px 50px',
  backgroundColor: '#251c18',
  color: '#f9f9f9',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const btnText = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '1rem',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  borderBottom: '2px solid #c4a457',
  paddingBottom: '3px',
  display: 'inline-block'
};

export default Perfil;
