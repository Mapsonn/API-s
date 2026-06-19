import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk: LoginJWT.jsx llama a loginUser(credentials)
// authSlice hace la llamada al endpoint y maneja los estados async
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        return rejectWithValue('Email o contraseña incorrectos.');
      }
      return await response.json(); // { token, id, nombre, apellido, role }
    } catch {
      return rejectWithValue('Error de conexión con el servidor.');
    }
  }
);

// El estado inicial es vacío — redux-persist rehidrata desde sessionStorage al hacer F5
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    usuario: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.usuario = action.payload.usuario;
      state.isAuthenticated = Boolean(action.payload.token && action.payload.usuario);
    },
    logout: (state) => {
      state.token = null;
      state.usuario = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // pending → isLoading=true, limpia error anterior
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // fulfilled → guarda token y usuario, isAuthenticated=true
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.usuario = {
          id: action.payload.id,
          nombre: action.payload.nombre,
          apellido: action.payload.apellido,
          email: action.payload.email,
          role: action.payload.role,
        };
        state.isAuthenticated = true;
        state.error = null;
      })
      // rejected → muestra error
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
