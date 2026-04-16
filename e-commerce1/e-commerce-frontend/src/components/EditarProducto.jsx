import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditarProducto({ usuarioLogueado }) {
  // Sacamos el ID del producto de la URL (ej: /editar-producto/5)
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [imagen, setImagen] = useState(null); // Para la nueva imagen si se sube
  
  // Estados auxiliares
  const [categorias, setCategorias] = useState([]);
  const [imagenActualUrl, setImagenActualUrl] = useState(''); // Para mostrar la foto que ya tiene
  const [previewNueva, setPreviewNueva] = useState(null); // Para la vista previa de la nueva foto
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // 1. Cargar todas las categorías para el desplegable
    axios.get('http://localhost:8080/api/categorias')
      .then(res => setCategorias(res.data))
      .catch(err => console.error("Error cargando categorías:", err));

    // 2. Cargar los datos actuales del producto que vamos a editar
    axios.get(`http://localhost:8080/api/productos/${id}`)
      .then(res => {
        const p = res.data;
        // Rellenamos los estados con los datos que trajo Java
        setNombre(p.nombre);
        setDescripcion(p.descripcion);
        setPrecio(p.precio);
        setStock(p.stock);
        setCategoriaId(p.categoria?.id || ''); // Usamos el ID de la categoría
        // Guardamos la URL de la imagen actual (usando tu ruta que funciona: /imagenes/)
        setImagenActualUrl(`http://localhost:8080/imagenes/${p.imagenUrl}`);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error cargando producto:", err);
        alert("No se pudo cargar el producto. ¿Existe el ID?");
        navigate('/mis-productos'); // Volvemos si hay error
      });
  }, [id, navigate]);

  const manejarEnvio = async (e) => {
    e.preventDefault();

    // Validación de seguridad (No negativos, Lucas)
    if (precio < 0 || stock < 0) {
      alert("Lucas, el precio y el stock deben ser valores positivos.");
      return;
    }

    const usuarioDeRespaldo = JSON.parse(localStorage.getItem("usuario"));
    const usuarioReal = usuarioLogueado || usuarioDeRespaldo;

    if (!usuarioReal) {
      alert("Sesión expirada. Por favor, logueate de nuevo.");
      navigate('/login');
      return;
    }

    // Usamos FormData porque hay una posible imagen
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('stock', stock);
    formData.append('categoriaId', categoriaId);
    formData.append('usuarioId', usuarioReal.id); // Mantenemos el dueño

    // Solo mandamos la imagen si el usuario seleccionó una NUEVA
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      // IMPORTANTE: Usamos .put() para actualizar, indicando el ID en la URL
      await axios.put(`http://localhost:8080/api/productos/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Producto actualizada con éxito en el catalogo!");
      navigate('/mis-productos'); // Volvemos al panel de control
    } catch (error) {
      console.error("Error al editar:", error.response?.data);
      alert("No se pudo actualizar el producto. Revisa los datos en la consola.");
    }
  };

  // Función para manejar el cambio de imagen y generar la vista previa
  const manejarCambioImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setImagen(archivo);
      setPreviewNueva(URL.createObjectURL(archivo)); // Genera una URL temporal para verla
    }
  };

  if (cargando) return <div style={loadingStyle}>Cargando archivo de diseño...</div>;

  return (
    <div style={pageBackground}>
      <h1 style={titleStyle}>Editar Producto del Catalogo</h1>
      
      <div style={containerStyle}>
        <form onSubmit={manejarEnvio} style={formStyle}>
          
          {/* Campo Nombre */}
          <div style={inputGroup}>
            <label style={labelStyle}>Nombre del Producto</label>
            <input 
              type="text" 
              value={nombre} // Valor precargado
              style={inputStyle} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
            />
          </div>

          {/* Campo Descripción */}
          <div style={inputGroup}>
            <label style={labelStyle}>Descripción</label>
            <textarea 
              style={textareaStyle} 
              value={descripcion} // Valor precargado
              onChange={(e) => setDescripcion(e.target.value)} 
              required 
            />
          </div>

          {/* Fila Precio y Stock */}
          <div style={rowStyle}>
            <div style={{...inputGroup, width: '48%'}}>
              <label style={labelStyle}>Precio ($)</label>
              <input 
                type="number" 
                value={precio} // Valor precargado
                min="0" // No negativos
                step="0.01"
                style={inputStyle} 
                onChange={(e) => setPrecio(e.target.value)} 
                required 
              />
            </div>
            <div style={{...inputGroup, width: '48%'}}>
              <label style={labelStyle}>Stock</label>
              <input 
                type="number" 
                value={stock} // Valor precargado
                min="0" // No negativos
                style={inputStyle} 
                onChange={(e) => setStock(Number(e.target.value))} 
                required
              />
            </div>
          </div>

          {/* Campo Categoría */}
          <div style={inputGroup}>
            <label style={labelStyle}>Categoría</label>
            <select 
              style={selectStyle} 
              value={categoriaId} // Valor precargado
              onChange={(e) => setCategoriaId(e.target.value)} 
              required
            >
              <option value="">Seleccionar Categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombreCategoria || cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Sección de Imagen */}
          <div style={fileSectionContainer}>
            <label style={labelStyle}>Imagen del producto</label>
            
            <div style={imageDisplayRow}>
              {/* Mostramos la imagen actual */}
              <div style={imageBox}>
                <span style={imageBoxLabel}>Actual</span>
                <img src={imagenActualUrl} alt="Actual" style={miniPreviewStyle} />
              </div>

              {/* Mostramos la vista previa de la nueva si existe */}
              {previewNueva && (
                <div style={imageBox}>
                  <span style={imageBoxLabel}>Nueva</span>
                  <img src={previewNueva} alt="Nueva vista previa" style={miniPreviewStyle} />
                </div>
              )}
            </div>

            <input 
              type="file" 
              style={fileInputStyle}
              onChange={manejarCambioImagen}
              accept="image/*" // Solo imágenes
            />
            <p style={helpTextStyle}>* Dejar vacío si no deseas cambiar la imagen.</p>
          </div>

          {/* Botones de Acción */}
          <div style={buttonRowStyle}>
            <button type="submit" style={btnSaveStyle}>
              <span style={btnTextInnerStyle}>Guardar Cambios</span>
            </button>
            
            <button type="button" onClick={() => navigate('/mis-productos')} style={btnCancelStyle}>
              <span style={btnTextInnerSmall}>Cancelar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- ESTILOS "ESTUDIO 40" UNIFICADOS ---

const pageBackground = { 
  padding: '80px 0', 
  minHeight: '100vh', 
  backgroundColor: '#efefef' // Gris suave de fondo general
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
  maxWidth: '750px', 
  margin: '0 auto', 
  padding: '50px', 
  backgroundColor: '#f5f0e8', // Fondo crema vintage
  borderRadius: '40px', // Sello de 40px
  boxShadow: '0 15px 35px rgba(37, 28, 24, 0.08)' 
};

const formStyle = { display: 'flex', flexDirection: 'column', gap: '25px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px' };
const rowStyle = { display: 'flex', justifyContent: 'space-between' };

const labelStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '0.9rem',
  color: '#251c18',
  textTransform: 'uppercase',
  letterSpacing: '1px'
};

const inputStyle = { 
  width: '100%', 
  padding: '15px 20px', 
  borderRadius: '4px', // Radius pedido de 4px
  border: '1px solid rgba(37, 28, 24, 0.15)', 
  backgroundColor: 'white', 
  color: '#251c18', 
  fontSize: '1rem', 
  outline: 'none', 
  boxSizing: 'border-box',
  fontFamily: 'inherit'
};

const textareaStyle = { 
  ...inputStyle, 
  height: '120px', 
  resize: 'none'
};

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none' // Quita la flecha por defecto para estilizar
};

// Estilos de la sección de imagen
const fileSectionContainer = {
  padding: '20px',
  border: '1px dashed #c9a84c', // Borde dorado discontinuo
  borderRadius: '4px',
  backgroundColor: 'white'
};

const imageDisplayRow = {
  display: 'flex',
  gap: '20px',
  marginBottom: '20px',
  justifyContent: 'center'
};

const imageBox = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '5px'
};

const imageBoxLabel = {
  fontSize: '0.7rem',
  color: '#888',
  textTransform: 'uppercase'
};

const miniPreviewStyle = { 
  width: '120px', 
  height: '120px', 
  objectFit: 'cover', 
  borderRadius: '4px',
  border: '1px solid #251c18'
};

const fileInputStyle = {
  fontFamily: 'inherit',
  color: '#251c18',
  width: '100%'
};

const helpTextStyle = {
  fontSize: '0.8rem',
  color: '#666',
  fontStyle: 'italic',
  marginTop: '10px',
  textAlign: 'center'
};

// Botones
const buttonRowStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  marginTop: '30px'
};

const baseBtnStyle = { 
  padding: '18px', 
  border: 'none', 
  borderRadius: '4px', // Radius pedido de 4px
  cursor: 'pointer',
  transition: '0.3s',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const btnSaveStyle = { 
  ...baseBtnStyle,
  backgroundColor: '#251c18', // Marrón oscuro Estudio 40
  color: '#f9f9f9'
};

const btnCancelStyle = {
  ...baseBtnStyle,
  backgroundColor: 'transparent',
  border: '1px solid #251c18',
  color: '#251c18',
  padding: '12px'
};

// Texto interno con línea dorada
const btnTextInnerStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '1.1rem',
  letterSpacing: '3px',
  textTransform: 'uppercase',
  borderBottom: '2px solid #c9a84c', // Línea dorada interna
  paddingBottom: '3px',
  display: 'inline-block'
};

const btnTextInnerSmall = {
  ...btnTextInnerStyle,
  fontSize: '0.8rem',
  letterSpacing: '1px',
  borderBottom: '1px solid #251c18' // Línea marrón para cancelar
};

const loadingStyle = { 
  textAlign: 'center', 
  padding: '100px', 
  fontFamily: "'Playfair Display', serif", 
  fontSize: '1.5rem',
  color: '#251c18' 
};

export default EditarProducto;