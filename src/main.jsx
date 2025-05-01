// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
// --- 1. Import BrowserRouter ---
import { BrowserRouter } from 'react-router-dom';
// -----------------------------
import App from './App.jsx'; // Import the main App component
import { AuthProvider } from './contexts/AuthContext.jsx'; // Import the AuthProvider
import './index.css'; // Import Tailwind CSS base

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* --- 2. Wrap AuthProvider and App with BrowserRouter --- */}
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    {/* ------------------------------------------------------ */}
  </React.StrictMode>
);