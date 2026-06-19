import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import carritoReducer from './carritoSlice';
import favoritosReducer from './favoritosSlice';
import uiReducer from './uiSlice';
import perfilReducer from './perfilSlice';
import ordenesReducer from './ordenesSlice';
import { ecommerceApi } from './api/ecommerceApi';

const store = configureStore({
  reducer: {
    auth: authReducer,
    carrito: carritoReducer,
    favoritos: favoritosReducer,
    ui: uiReducer,
    perfil: perfilReducer,
    ordenes: ordenesReducer,
    [ecommerceApi.reducerPath]: ecommerceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ecommerceApi.middleware),
});

store.subscribe(() => {
  const { auth, carrito, favoritos, ui, perfil, ordenes } = store.getState();

  // Persistencia de Auth
  if (auth.token && auth.usuario) {
    localStorage.setItem('token', auth.token);
    localStorage.setItem('usuario', JSON.stringify(auth.usuario));
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  // Persistencia de Carrito (solo en BD ahora, pero mantenemos caché local opcional)
  localStorage.setItem('cartItems', JSON.stringify(carrito.items));

  // Persistencia de Favoritos (solo en BD ahora, pero mantenemos caché local opcional)
  localStorage.setItem('favoriteItems', JSON.stringify(favoritos.items));

  // Persistencia de UI
  localStorage.setItem('uiState', JSON.stringify(ui));
});

export default store;
