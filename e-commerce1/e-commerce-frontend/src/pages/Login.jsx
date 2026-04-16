import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get('http://localhost:8080/api/usuarios');
      const usuarios = res.data;

      const usuarioEncontrado = usuarios.find(u => u.email === email && u.password === password);

      if (usuarioEncontrado) {
        localStorage.setItem("usuario", JSON.stringify(usuarioEncontrado));
        alert(`¡Hola de nuevo, ${usuarioEncontrado.nombre}!`);
        window.location.href = "/"; 
      } else {
        alert("Email o contraseña incorrectos. Revisá los datos.");
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div style={pageBackground}>
      {/* Título en color 251c18 */}
      <h1 style={titleStyle}>Iniciar Sesion</h1>
      <div style={containerStyle}>
        <form onSubmit={handleLogin} style={formStyle}>
          <input 
            type="email" 
            placeholder="E-mail" 
            onChange={e => setEmail(e.target.value)} 
            required 
            style={inputStyle} 
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={inputStyle} 
          />
          
          {/* Botón mantiene el texto amarillo (fbbf24) */}
          <button type="submit" style={btnStyle}>
            Iniciar Sesion
          </button>
        </form>
      </div>
    </div>
  );
}

// --- ESTILOS ACTUALIZADOS ---

const pageBackground = { 
  padding: '50px 0', 
  minHeight: '80vh',
  backgroundColor: '#efefef' // Fondo gris claro para que resalten las letras oscuras
};

const titleStyle = { 
  textAlign: 'center', 
  fontSize: '3.5rem', 
  marginBottom: '30px', 
  fontWeight: '400',
  color: '#251c18' // Color solicitado
};

const containerStyle = { 
  maxWidth: '500px', 
  margin: '0 auto', 
  padding: '60px 40px', 
  backgroundColor: '#f9f9f9', 
  borderRadius: '40px', 
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
};

const formStyle = { display: 'flex', flexDirection: 'column', gap: '25px', alignItems: 'center' };

const inputStyle = { 
  width: '85%', 
  padding: '12px 20px', 
  border: '1px solid #251c18', // Borde en el color oscuro para que se vea bien
  borderRadius: '25px', 
  backgroundColor: 'white',
  color: '#251c18', // Texto que escribe el usuario en color oscuro
  fontSize: '16px',
  outline: 'none'
};

const btnStyle = { 
  marginTop: '20px',
  padding: '12px 50px', 
  backgroundColor: '#1f2937', 
  color: '#fbbf24', // MANTENEMOS EL AMARILLO AQUÍ
  border: 'none', 
  borderRadius: '25px', 
  cursor: 'pointer', 
  fontWeight: 'bold',
  fontSize: '16px'
};

export default Login;