import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { IsopenContextProvider } from './context/isopenContext';

ReactDOM.render(
  <React.StrictMode>
    <IsopenContextProvider>
      <App />
    </IsopenContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
