import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist';

// sessionStorage: sobrevive F5 pero se borra al cerrar la pestaña.
// Mitiga XSS vs localStorage: no persiste entre pestañas ni sesiones.
const sessionStorageEngine = {
  getItem:    (key)        => Promise.resolve(sessionStorage.getItem(key)),
  setItem:    (key, value) => Promise.resolve(sessionStorage.setItem(key, value)),
  removeItem: (key)        => Promise.resolve(sessionStorage.removeItem(key)),
};

import authReducer from './authSlice';
import carritoReducer from './carritoSlice';
import favoritosReducer from './favoritosSlice';
import uiReducer from './uiSlice';
import { ecommerceApi } from './api/ecommerceApi';

const authPersistConfig = {
  key: 'auth',
  storage: sessionStorageEngine,
  whitelist: ['token', 'usuario', 'isAuthenticated'],
};

const carritoPersistConfig = {
  key: 'carrito',
  storage: sessionStorageEngine,
  whitelist: ['items'],
};

const favoritosPersistConfig = {
  key: 'favoritos',
  storage: sessionStorageEngine,
  whitelist: ['items'],
};

const store = configureStore({
  reducer: {
    auth:      persistReducer(authPersistConfig,      authReducer),
    carrito:   persistReducer(carritoPersistConfig,   carritoReducer),
    favoritos: persistReducer(favoritosPersistConfig, favoritosReducer),
    ui: uiReducer,
    [ecommerceApi.reducerPath]: ecommerceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(ecommerceApi.middleware),
});

export const persistor = persistStore(store);
export default store;
