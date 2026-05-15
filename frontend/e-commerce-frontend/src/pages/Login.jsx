import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setUsuarioLogueado }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
      const { token, id, nombre, apellido, role } = res.data;

      localStorage.setItem("token", token);
      const usuario = { id, nombre, apellido, email, role };
      localStorage.setItem("usuario", JSON.stringify(usuario));
      setUsuarioLogueado(usuario);

      alert(`¡Bienvenido de nuevo, ${nombre}!`);
      navigate('/');
    } catch (error) {
      alert("Email o contraseña incorrectos. Revisá los datos.");
    }
  };

  return (
    <div style={pageBackground}>
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
          <button type="submit" style={btnStyle}>
            Iniciar Sesion
          </button>
        </form>
      </div>
    </div>
  );
}

const pageBackground = {
  padding: '50px 0',
  minHeight: '80vh',
  backgroundColor: '#efefef'
};

const titleStyle = {
  textAlign: 'center',
  fontSize: '3.5rem',
  marginBottom: '30px',
  fontWeight: '400',
  color: '#251c18'
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
  border: '1px solid #251c18',
  borderRadius: '25px',
  backgroundColor: 'white',
  color: '#251c18',
  fontSize: '16px',
  outline: 'none'
};

const btnStyle = {
  marginTop: '20px',
  padding: '12px 50px',
  backgroundColor: '#1f2937',
  color: '#fbbf24',
  border: 'none',
  borderRadius: '25px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px'
};

export default Login;
