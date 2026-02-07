
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Immediate polyfill for browser context
if (typeof window !== 'undefined') {
  (window as any).process = { env: { API_KEY: (window as any).process?.env?.API_KEY || '' } };
}

console.log("Area Guard: Initializing Command Layer...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Failure: Root element not found.");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
