import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCarrito = createAsyncThunk(
  'carrito/fetchCarrito',
  async (usuarioId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`http://localhost:8080/api/carrito/${usuarioId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al cargar carrito');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error?.message || 'Error desconocido');
    }
  }
);

export const agregarAlCarritoAsync = createAsyncThunk(
  'carrito/agregarAlCarrito',
  async ({ usuarioId, productoId, cantidad }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(
        `http://localhost:8080/api/carrito/agregar?usuarioId=${usuarioId}&productoId=${productoId}&cantidad=${cantidad}`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error('Error al agregar al carrito');
      const carritoResponse = await fetch(`http://localhost:8080/api/carrito/${usuarioId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return await carritoResponse.json();
    } catch (error) {
      return rejectWithValue(error?.message || 'Error desconocido');
    }
  }
);

export const eliminarDelCarritoAsync = createAsyncThunk(
  'carrito/eliminarDelCarrito',
  async ({ itemId, usuarioId }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`http://localhost:8080/api/carrito/eliminar/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al eliminar del carrito');
      const carritoResponse = await fetch(`http://localhost:8080/api/carrito/${usuarioId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return await carritoResponse.json();
    } catch (error) {
      return rejectWithValue(error?.message || 'Error desconocido');
    }
  }
);

export const vaciarCarritoAsync = createAsyncThunk(
  'carrito/vaciarCarrito',
  async (usuarioId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`http://localhost:8080/api/carrito/vaciar/${usuarioId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al vaciar carrito');
      const carritoResponse = await fetch(`http://localhost:8080/api/carrito/${usuarioId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return await carritoResponse.json();
    } catch (error) {
      return rejectWithValue(error?.message || 'Error desconocido');
    }
  }
);

const carritoSlice = createSlice({
  name: 'carrito',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    limpiarError: (state) => {
      state.error = null;
    },
    limpiarCarrito: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarrito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarrito.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCarrito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(agregarAlCarritoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(agregarAlCarritoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(agregarAlCarritoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(eliminarDelCarritoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarDelCarritoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(eliminarDelCarritoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(vaciarCarritoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(vaciarCarritoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(vaciarCarritoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { limpiarError, limpiarCarrito } = carritoSlice.actions;
export default carritoSlice.reducer;
