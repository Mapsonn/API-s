import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ======= ASYNC THUNKS =======

export const obtenerPerfilAsync = createAsyncThunk(
  'perfil/obtenerPerfil',
  async (usuarioId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/usuarios/${usuarioId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al cargar perfil');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error?.message || 'Error desconocido');
    }
  }
);

export const actualizarPerfilAsync = createAsyncThunk(
  'perfil/actualizarPerfil',
  async ({ usuarioId, datosActualizados }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosActualizados),
      });
      if (!response.ok) throw new Error('Error al actualizar perfil');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error?.message || 'Error desconocido');
    }
  }
);

// ======= ESTADO INICIAL =======

const initialState = {
  perfil: null, // Usuario completo
  direcciones: [], // Múltiples direcciones
  loading: false,
  error: null,
  lastUpdated: null,
};

// ======= SLICE =======

const perfilSlice = createSlice({
  name: 'perfil',
  initialState,
  reducers: {
    limpiarErrorPerfil: (state) => {
      state.error = null;
    },
    resetearPerfil: (state) => {
      state.perfil = null;
      state.direcciones = [];
      state.error = null;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    // ===== OBTENER PERFIL =====
    builder
      .addCase(obtenerPerfilAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(obtenerPerfilAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.perfil = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(obtenerPerfilAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== ACTUALIZAR PERFIL =====
    builder
      .addCase(actualizarPerfilAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarPerfilAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.perfil = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(actualizarPerfilAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { limpiarErrorPerfil, resetearPerfil } = perfilSlice.actions;

export default perfilSlice.reducer;
