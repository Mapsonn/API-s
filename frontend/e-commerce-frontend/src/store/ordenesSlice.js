import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ======= ASYNC THUNKS =======

export const obtenerMisOrdenesAsync = createAsyncThunk(
  'ordenes/obtenerMisOrdenes',
  async (usuarioId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/ordenes/${usuarioId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al cargar órdenes');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error?.message || 'Error desconocido');
    }
  }
);

export const obtenerDetalleOrdenAsync = createAsyncThunk(
  'ordenes/obtenerDetalleOrden',
  async (ordenId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/ordenes/${ordenId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al cargar orden');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error?.message || 'Error desconocido');
    }
  }
);

export const crearOrdenAsync = createAsyncThunk(
  'ordenes/crearOrden',
  async ({ usuarioId, datosOrden }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/ordenes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId,
          ...datosOrden,
        }),
      });
      if (!response.ok) throw new Error('Error al crear orden');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error?.message || 'Error desconocido');
    }
  }
);

export const cancelarOrdenAsync = createAsyncThunk(
  'ordenes/cancelarOrden',
  async (ordenId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/ordenes/${ordenId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al cancelar orden');
      return await response.text();
    } catch (error) {
      return rejectWithValue(error?.message || 'Error desconocido');
    }
  }
);

// ======= ESTADO INICIAL =======

const initialState = {
  ordenes: [], // Lista de órdenes del usuario
  ordenActual: null, // Orden en detalle
  loading: false,
  loadingDetalle: false,
  error: null,
  errorDetalle: null,
};

// ======= SLICE =======

const ordenesSlice = createSlice({
  name: 'ordenes',
  initialState,
  reducers: {
    limpiarErrorOrdenes: (state) => {
      state.error = null;
      state.errorDetalle = null;
    },
    resetearOrdenes: (state) => {
      state.ordenes = [];
      state.ordenActual = null;
      state.error = null;
      state.errorDetalle = null;
    },
  },
  extraReducers: (builder) => {
    // ===== OBTENER MIS ÓRDENES =====
    builder
      .addCase(obtenerMisOrdenesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(obtenerMisOrdenesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.ordenes = action.payload;
      })
      .addCase(obtenerMisOrdenesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== OBTENER DETALLE ORDEN =====
    builder
      .addCase(obtenerDetalleOrdenAsync.pending, (state) => {
        state.loadingDetalle = true;
        state.errorDetalle = null;
      })
      .addCase(obtenerDetalleOrdenAsync.fulfilled, (state, action) => {
        state.loadingDetalle = false;
        state.ordenActual = action.payload;
      })
      .addCase(obtenerDetalleOrdenAsync.rejected, (state, action) => {
        state.loadingDetalle = false;
        state.errorDetalle = action.payload;
      });

    // ===== CREAR ORDEN =====
    builder
      .addCase(crearOrdenAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearOrdenAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.ordenes.push(action.payload);
      })
      .addCase(crearOrdenAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== CANCELAR ORDEN =====
    builder
      .addCase(cancelarOrdenAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelarOrdenAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Eliminar de la lista
        state.ordenes = state.ordenes.filter((orden) => orden.id !== action.payload);
      })
      .addCase(cancelarOrdenAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { limpiarErrorOrdenes, resetearOrdenes } = ordenesSlice.actions;

export default ordenesSlice.reducer;
