import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Usa o localStorage por padrão

// Importa o seu 'combineReducers' que já existe
import reducer from './reducer'; 

// Configuração do Redux Persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['customization', 'account', 'menu'] 
};

// Cria um novo reducer "persistido"
const persistedReducer = persistReducer(persistConfig, reducer);

// Configura a store para usar o reducer persistido
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignora estas ações que são do redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

// Cria o persistor que será usado pelo PersistGate
const persistor = persistStore(store);

// Exporta a store e o persistor
export { store, persistor };