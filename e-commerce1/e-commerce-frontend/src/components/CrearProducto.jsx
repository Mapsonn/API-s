import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CrearProducto({ usuarioLogueado }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [imagen, setImagen] = useState(null);
  const [categorias, setCategorias] = useState([]); // Se inicializa como array vacío
  
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/api/categorias')
      .then(res => {
        // CORRECCIÓN: Validamos que res.data sea un array antes de guardarlo
        setCategorias(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Error categorías:", err);
        setCategorias([]); // En caso de error, mantenemos el array vacío para que no rompa el .map
      });
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    // Recuperamos el usuario de respaldo de forma segura
    const localUser = localStorage.getItem("usuario");
    const usuarioDeRespaldo = localUser ? JSON.parse(localUser) : null;
    const usuarioReal = usuarioLogueado || usuarioDeRespaldo;

    if (!usuarioReal) {
      alert("Debes iniciar sesión para publicar.");
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('stock', stock);
    formData.append('categoriaId', categoriaId);
    formData.append('usuarioId', usuarioReal.id); 

    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      await axios.post('http://localhost:8080/api/productos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Producto publicado con éxito.");
      navigate('/mis-productos'); 
    } catch (error) {
      console.error("Error en el envío:", error.response?.data);
      alert("Error al publicar. Revisa los datos.");
    }
  };

  return (
    <div style={pageBackground}>
      <h1 style={titleStyle}>Publicar Nuevo Producto</h1>
      
      <div style={containerStyle}>
        <form onSubmit={manejarEnvio} style={formStyle}>
          
          <div style={inputGroup}>
            <label style={labelStyle}>Nombre del producto</label>
            <input 
              type="text" 
              placeholder="Ej: Remera Lino Vintage" 
              style={inputStyle} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Descripción detallada</label>
            <textarea 
              placeholder="Describe el corte, la tela..." 
              style={textareaStyle} 
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)} 
              required 
            />
          </div>

          <div style={rowStyle}>
            <div style={{...inputGroup, width: '48%'}}>
              <label style={labelStyle}>Precio ($)</label>
              <input 
                type="number" 
                min="0" 
                step="0.01" 
                placeholder="Precio" 
                style={inputStyle} 
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (val >= 0 || e.target.value === "") setPrecio(e.target.value);
                }} 
                value={precio}
                required 
              />
            </div>
            <div style={{...inputGroup, width: '48%'}}>
              <label style={labelStyle}>Stock</label>
              <input 
                type="number" 
                min="0" 
                placeholder="Cant." 
                style={inputStyle} 
                onChange={(e) => setStock(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Categoría</label>
            <select 
              style={selectStyle} 
              onChange={(e) => setCategoriaId(e.target.value)} 
              required
              value={categoriaId}
            >
              <option value="">Seleccionar Categoría</option>
              {/* CORRECCIÓN: Renderizado seguro con validación de array */}
              {Array.isArray(categorias) && categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombreCategoria || cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div style={fileContainer}>
            <label style={labelStyle}>Imagen del producto</label>
            <input 
              type="file" 
              style={fileInput}
              onChange={(e) => setImagen(e.target.files[0])} 
              required 
            />
          </div>

          <button type="submit" style={btnPublishStyle}>
            <span style={btnTextInner}>+ Publicar Producto</span>
          </button>
        </form>
      </div>
    </div>
  );
}

// ... (Tus estilos se mantienen iguales)
const pageBackground = { padding: '80px 0', minHeight: '100vh', backgroundColor: '#efefef' };
const titleStyle = { textAlign: 'center', fontSize: '3.5rem', marginBottom: '50px', color: '#251c18', fontFamily: "'Playfair Display', serif", fontWeight: '400' };
const containerStyle = { maxWidth: '700px', margin: '0 auto', padding: '50px', backgroundColor: '#f5f0e8', borderRadius: '40px', boxShadow: '0 15px 35px rgba(37, 28, 24, 0.08)' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '25px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px' };
const rowStyle = { display: 'flex', justifyContent: 'space-between' };
const labelStyle = { fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: '#251c18', textTransform: 'uppercase', letterSpacing: '1px' };
const inputStyle = { width: '100%', padding: '15px 20px', borderRadius: '4px', border: '1px solid rgba(37, 28, 24, 0.2)', backgroundColor: 'white', color: '#251c18', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
const textareaStyle = { ...inputStyle, height: '120px', resize: 'none' };
const selectStyle = { ...inputStyle, cursor: 'pointer' };
const fileContainer = { padding: '20px', border: '1px dashed #c9a84c', borderRadius: '4px', backgroundColor: 'rgba(201, 168, 76, 0.05)' };
const fileInput = { fontFamily: 'inherit', color: '#251c18' };
const btnPublishStyle = { marginTop: '30px', padding: '20px', backgroundColor: '#251c18', color: '#f9f9f9', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: '0.3s' };
const btnTextInner = { fontFamily: "'Playfair Display', serif", textTransform: 'uppercase', fontSize: '1rem', letterSpacing: '2px', borderBottom: '2px solid #c9a84c', paddingBottom: '3px', display: 'inline-block' };

export default CrearProducto;