import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { NeonAuthUIProvider } from '@neondatabase/auth-ui';
import { neonClient } from './lib/neonAuth';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <NeonAuthUIProvider client={neonClient}>
        <App />
      </NeonAuthUIProvider>
    </BrowserRouter>
  </React.StrictMode>
);