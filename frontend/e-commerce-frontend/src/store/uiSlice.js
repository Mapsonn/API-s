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
            textSize: 'normal', // normal | large | extra-large
            highContrast: false,
            reducedMotion: false,
          },
          notifications: {
            autoClose: true,
            duration: 3000, // ms
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
    // ====== TEMA ======
    cambiarTema: (state, action) => {
      // 'light' | 'dark' | 'auto'
      state.theme = action.payload;
    },

    // ====== IDIOMA ======
    cambiarIdioma: (state, action) => {
      // 'es' | 'en' | 'pt'
      state.idioma = action.payload;
    },

    // ====== ACCESIBILIDAD ======
    cambiarTamañoTexto: (state, action) => {
      // 'normal' | 'large' | 'extra-large'
      state.accesibilidad.textSize = action.payload;
    },

    toggleAltoContraste: (state) => {
      state.accesibilidad.highContrast = !state.accesibilidad.highContrast;
    },

    toggleMovimientoReducido: (state) => {
      state.accesibilidad.reducedMotion = !state.accesibilidad.reducedMotion;
    },

    // ====== NOTIFICACIONES ======
    establecerAutoClose: (state, action) => {
      state.notifications.autoClose = action.payload;
    },

    establecerDuracionNotificacion: (state, action) => {
      state.notifications.duration = action.payload;
    },

    // ====== RESET ======
    resetearUI: (state) => {
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
