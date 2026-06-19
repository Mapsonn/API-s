import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist';
// sessionStorage: sobrevive F5 pero se borra al cerrar la pestaña.
// Mitiga XSS vs localStorage: no persiste entre pestañas ni sesiones.
// La solución definitiva sería httpOnly cookies en el backend
// (JS no puede leerlas en absoluto), pero requiere cambios en Spring Boot.
import storageSession from 'redux-persist/lib/storage/session';

import authReducer from './authSlice';
import carritoReducer from './carritoSlice';
import favoritosReducer from './favoritosSlice';
import uiReducer from './uiSlice';
import perfilReducer from './perfilSlice';
import ordenesReducer from './ordenesSlice';
import { ecommerceApi } from './api/ecommerceApi';

const authPersistConfig = {
  key: 'auth',
  storage: storageSession,
  whitelist: ['token', 'usuario', 'isAuthenticated'],
};

const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    carrito: carritoReducer,
    favoritos: favoritosReducer,
    ui: uiReducer,
    perfil: perfilReducer,
    ordenes: ordenesReducer,
    [ecommerceApi.reducerPath]: ecommerceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // redux-persist usa acciones no serializables internamente
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(ecommerceApi.middleware),
});

export const persistor = persistStore(store);
export default store;
