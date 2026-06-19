import { createSlice } from '@reduxjs/toolkit';

const cargarAuth = () => {
  try {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

    return {
      token,
      usuario,
      isAuthenticated: Boolean(token && usuario),
    };
  } catch {
    return {
      token: null,
      usuario: null,
      isAuthenticated: false,
    };
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: cargarAuth(),
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
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
