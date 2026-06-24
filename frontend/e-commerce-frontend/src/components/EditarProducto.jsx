import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useEditarProductoMutation,
  useGetCategoriasQuery,
  useGetProductoByIdQuery,
} from '../store/api/ecommerceApi';

function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuarioReal = useSelector((state) => state.auth.usuario);
  const [editarProducto] = useEditarProductoMutation();
  const { data: categorias = [] } = useGetCategoriasQuery();
  const { data: producto, isError } = useGetProductoByIdQuery(id);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenActualUrl, setImagenActualUrl] = useState('');
  const [previewNueva, setPreviewNueva] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (isError) {
      alert("No se pudo cargar el producto.");
      navigate('/mis-productos');
      return;
    }
    if (!producto) return;
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setPrecio(producto.precio);
    setStock(producto.stock);
    setCategoriaId(producto.categoriaId || '');
    setImagenActualUrl(
      producto.imagenesUrl?.[0]
        ? `http://localhost:8080/imagenes/${producto.imagenesUrl[0]}`
        : ''
    );
    setCargando(false);
  }, [producto, isError, navigate]);

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (precio < 0 || stock < 0) {
      alert("El precio y el stock deben ser valores positivos.");
      return;
    }

    if (!usuarioReal) {
      alert("Sesión expirada. Por favor, logueate de nuevo.");
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
      formData.append('imagenes', imagen);
    }

    try {
      await editarProducto({ id, formData }).unwrap();
      alert("Producto actualizado con éxito!");
      navigate('/mis-productos');
    } catch (error) {
      console.error("Error al editar:", error.response?.data);
      alert("No se pudo actualizar el producto.");
    }
  };

  const manejarCambioImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setImagen(archivo);
      setPreviewNueva(URL.createObjectURL(archivo));
    }
  };

  if (cargando) return <div style={loadingStyle}>Cargando...</div>;

  return (
    <div style={pageBackground}>
      <h1 style={titleStyle}>Editar Producto del Catalogo</h1>

      <div style={containerStyle}>
        <form onSubmit={manejarEnvio} style={formStyle}>

          <div style={inputGroup}>
            <label style={labelStyle}>Nombre del Producto</label>
            <input
              type="text"
              value={nombre}
              style={inputStyle}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Descripción</label>
            <textarea
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
                value={precio}
                min="0"
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
                value={stock}
                min="0"
                style={inputStyle}
                onChange={(e) => setStock(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Categoría</label>
            <select
              style={selectStyle}
              value={categoriaId}
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

          <div style={fileSectionContainer}>
            <label style={labelStyle}>Imagen del producto</label>

            <div style={imageDisplayRow}>
              <div style={imageBox}>
                <span style={imageBoxLabel}>Actual</span>
                <img src={imagenActualUrl} alt="Actual" style={miniPreviewStyle} />
              </div>
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
              accept="image/*"
            />
            <p style={helpTextStyle}>* Dejar vacío si no deseas cambiar la imagen</p>
          </div>

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

const pageBackground = {
  padding: '80px 0',
  minHeight: '100vh',
  backgroundColor: '#efefef',
};

const titleStyle = {
  textAlign: 'center',
  fontSize: '3.5rem',
  marginBottom: '50px',
  color: '#251c18',
  fontFamily: "'Playfair Display', serif",
  fontWeight: '400',
};

const containerStyle = {
  maxWidth: '750px',
  margin: '0 auto',
  padding: '50px',
  backgroundColor: '#f5f0e8',
  borderRadius: '40px',
  boxShadow: '0 15px 35px rgba(37, 28, 24, 0.08)',
};

const formStyle = { display: 'flex', flexDirection: 'column', gap: '25px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px' };
const rowStyle = { display: 'flex', justifyContent: 'space-between' };

const labelStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '0.9rem',
  color: '#251c18',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const inputStyle = {
  width: '100%',
  padding: '15px 20px',
  borderRadius: '4px',
  border: '1px solid rgba(37, 28, 24, 0.15)',
  backgroundColor: 'white',
  color: '#251c18',
  fontSize: '1rem',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const textareaStyle = { ...inputStyle, height: '120px', resize: 'none' };

const selectStyle = { ...inputStyle, cursor: 'pointer', appearance: 'none' };

const fileSectionContainer = {
  padding: '20px',
  border: '1px dashed #c9a84c',
  borderRadius: '4px',
  backgroundColor: 'white',
};

const imageDisplayRow = {
  display: 'flex',
  gap: '20px',
  marginBottom: '20px',
  justifyContent: 'center',
};

const imageBox = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '5px',
};

const imageBoxLabel = {
  fontSize: '0.7rem',
  color: '#888',
  textTransform: 'uppercase',
};

const miniPreviewStyle = {
  width: '120px',
  height: '120px',
  objectFit: 'cover',
  borderRadius: '4px',
  border: '1px solid #251c18',
};

const fileInputStyle = {
  fontFamily: 'inherit',
  color: '#251c18',
  width: '100%',
};

const helpTextStyle = {
  fontSize: '0.8rem',
  color: '#666',
  fontStyle: 'italic',
  marginTop: '10px',
  textAlign: 'center',
};

const buttonRowStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  marginTop: '30px',
};

const baseBtnStyle = {
  padding: '18px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: '0.3s',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const btnSaveStyle = { ...baseBtnStyle, backgroundColor: '#251c18', color: '#f9f9f9' };

const btnCancelStyle = {
  ...baseBtnStyle,
  backgroundColor: 'transparent',
  border: '1px solid #251c18',
  color: '#251c18',
  padding: '12px',
};

const btnTextInnerStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '1.1rem',
  letterSpacing: '3px',
  textTransform: 'uppercase',
  borderBottom: '2px solid #c9a84c',
  paddingBottom: '3px',
  display: 'inline-block',
};

const btnTextInnerSmall = {
  ...btnTextInnerStyle,
  fontSize: '0.8rem',
  letterSpacing: '1px',
  borderBottom: '1px solid #251c18',
};

const loadingStyle = {
  textAlign: 'center',
  padding: '100px',
  fontFamily: "'Playfair Display', serif",
  fontSize: '1.5rem',
  color: '#251c18',
};

export default EditarProducto;
