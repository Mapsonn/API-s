import { createSlice } from '@reduxjs/toolkit';

const cargarUIState = () => {
  try {
    const guardado = localStorage.getItem('uiState');
    return guardado
      ? JSON.parse(guardado)
      : {
          theme: 'light',
          idioma: 'es',
          accesibilidad: {
            textSize: 'normal',
            highContrast: false,
            reducedMotion: false,
          },
          notifications: {
            autoClose: true,
            duration: 3000,
          },
        };
  } catch {
    return {
      theme: 'light',
      idioma: 'es',
      accesibilidad: {
        textSize: 'normal',
        highContrast: false,
        reducedMotion: false,
      },
      notifications: {
        autoClose: true,
        duration: 3000,
      },
    };
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: cargarUIState(),
  reducers: {
    cambiarTema: (state, action) => {
      state.theme = action.payload;
    },
    cambiarIdioma: (state, action) => {
      state.idioma = action.payload;
    },
    cambiarTamañoTexto: (state, action) => {
      state.accesibilidad.textSize = action.payload;
    },
    toggleAltoContraste: (state) => {
      state.accesibilidad.highContrast = !state.accesibilidad.highContrast;
    },
    toggleMovimientoReducido: (state) => {
      state.accesibilidad.reducedMotion = !state.accesibilidad.reducedMotion;
    },
    establecerAutoClose: (state, action) => {
      state.notifications.autoClose = action.payload;
    },
    establecerDuracionNotificacion: (state, action) => {
      state.notifications.duration = action.payload;
    },
    resetearUI: () => {
      return cargarUIState();
    },
  },
});

export const {
  cambiarTema,
  cambiarIdioma,
  cambiarTamañoTexto,
  toggleAltoContraste,
  toggleMovimientoReducido,
  establecerAutoClose,
  establecerDuracionNotificacion,
  resetearUI,
} = uiSlice.actions;

export default uiSlice.reducer;
