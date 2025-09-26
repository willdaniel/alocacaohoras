import React from 'react';
import ReactDOM from 'react-dom/client';

// Redux
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store'; // <-- Importa a store e o persistor do novo arquivo

// project imports
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from './contexts/ConfigContext';

// style + assets
import 'assets/scss/style.scss';

// ==============================|| REACT DOM RENDER ||============================== //

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConfigProvider>
        <App />
      </ConfigProvider>
    </PersistGate>
  </Provider>
);

reportWebVitals();