import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../store/api/ecommerceApi';

function Registro() {
  const [form, setForm] = useState({
    username: '', password: '', email: '', nombre: '', apellido: ''
  });
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      await register(form).unwrap();
      alert("Usuario creado con exito. Ahora podes loguearte.");
      navigate('/login');
    } catch (error) {
      alert("Error: " + (error.data?.message || error.data || "Revisa los datos"));
    }
  };

  return (
    <div style={pageBackground}>
      <h2 style={titleStyle}>Crear Cuenta</h2>
      <div style={containerStyle}>
        <form onSubmit={manejarEnvio} style={formStyle}>
          <input type="text" placeholder="Username" required onChange={e => setForm({...form, username: e.target.value})} style={inputStyle} />
          <input type="text" placeholder="Nombre" required onChange={e => setForm({...form, nombre: e.target.value})} style={inputStyle} />
          <input type="text" placeholder="Apellido" required onChange={e => setForm({...form, apellido: e.target.value})} style={inputStyle} />
          <input type="email" placeholder="Email" required onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} />
          <input type="password" placeholder="Contrasena" required onChange={e => setForm({...form, password: e.target.value})} style={inputStyle} />

          <button type="submit" style={btnStyle} disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
}

const pageBackground = {
  padding: '40px 0',
  minHeight: '90vh',
  backgroundColor: '#efefef'
};

const titleStyle = {
  textAlign: 'center',
  fontSize: '3rem',
  marginBottom: '30px',
  fontWeight: '400',
  color: '#251c18'
};

const containerStyle = {
  maxWidth: '450px',
  margin: '0 auto',
  padding: '40px',
  backgroundColor: '#f9f9f9',
  borderRadius: '40px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
};

const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' };

const inputStyle = {
  width: '90%',
  padding: '12px 20px',
  borderRadius: '25px',
  border: '1px solid #251c18',
  backgroundColor: 'white',
  color: '#251c18',
  fontSize: '16px',
  outline: 'none'
};

const btnStyle = {
  marginTop: '10px',
  padding: '12px 50px',
  backgroundColor: '#1f2937',
  color: '#fbbf24',
  border: 'none',
  borderRadius: '25px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px'
};

export default Registro;
