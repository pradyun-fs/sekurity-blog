import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { Toaster } from "react-hot-toast"; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <App />
    </AuthProvider>
  </React.StrictMode>
)
