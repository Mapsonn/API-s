import { createSlice } from '@reduxjs/toolkit';

const favoritosSlice = createSlice({
  name: 'favoritos',
  initialState: {
    items: [],
  },
  reducers: {
    agregarAFavoritos: (state, action) => {
      const producto = action.payload;
      const existe = state.items.some((item) => item.id === producto.id);
      if (!existe) {
        state.items.push(producto);
      }
    },

    eliminarDeFavoritos: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    limpiarFavoritos: (state) => {
      state.items = [];
    },
  },
});

export const { agregarAFavoritos, eliminarDeFavoritos, limpiarFavoritos } = favoritosSlice.actions;
export default favoritosSlice.reducer;
