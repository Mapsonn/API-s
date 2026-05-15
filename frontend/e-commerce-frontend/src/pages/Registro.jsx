import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Registro() {
  const [form, setForm] = useState({
    username: '', password: '', email: '', nombre: '', apellido: ''
  });
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/register', form);
      alert("¡Usuario creado con éxito! Ahora podés loguearte.");
      navigate('/login');
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || "Revisá los datos"));
    }
  };

  return (
    <div style={pageBackground}>
      {/* Título en color 251c18 */}
      <h2 style={titleStyle}>Crear Cuenta</h2>
      <div style={containerStyle}>
        <form onSubmit={manejarEnvio} style={formStyle}>
          <input type="text" placeholder="Username" required onChange={e => setForm({...form, username: e.target.value})} style={inputStyle} />
          <input type="text" placeholder="Nombre" required onChange={e => setForm({...form, nombre: e.target.value})} style={inputStyle} />
          <input type="text" placeholder="Apellido" required onChange={e => setForm({...form, apellido: e.target.value})} style={inputStyle} />
          <input type="email" placeholder="Email" required onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} />
          <input type="password" placeholder="Contraseña" required onChange={e => setForm({...form, password: e.target.value})} style={inputStyle} />
          
          {/* El botón mantiene el color de texto amarillo solicitado */}
          <button type="submit" style={btnStyle}>Registrarse</button>
        </form>
      </div>
    </div>
  );
}

// --- ESTILOS ACTUALIZADOS ---

const pageBackground = { 
  padding: '40px 0', 
  minHeight: '90vh', 
  backgroundColor: '#efefef' // Fondo gris claro consistente con el resto
};

const titleStyle = { 
  textAlign: 'center', 
  fontSize: '3rem', 
  marginBottom: '30px', 
  fontWeight: '400',
  color: '#251c18' // COLOR SOLICITADO
};

const containerStyle = { 
  maxWidth: '450px', 
  margin: '0 auto', 
  padding: '40px', 
  backgroundColor: '#f9f9f9', // Blanco de las tarjetas
  borderRadius: '40px', // Bordes redondeados como tus bocetos
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)' 
};

const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' };

const inputStyle = { 
  width: '90%', 
  padding: '12px 20px', 
  borderRadius: '25px', 
  border: '1px solid #251c18', // Borde en el color oscuro
  backgroundColor: 'white',
  color: '#251c18', // Texto en color oscuro
  fontSize: '16px',
  outline: 'none'
};

const btnStyle = { 
  marginTop: '10px',
  padding: '12px 50px', 
  backgroundColor: '#1f2937', // Fondo oscuro del botón
  color: '#fbbf24', // TEXTO AMARILLO ORIGINAL
  border: 'none', 
  borderRadius: '25px', 
  cursor: 'pointer', 
  fontWeight: 'bold',
  fontSize: '16px'
};

export default Registro;