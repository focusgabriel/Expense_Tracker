import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './providers/AuthProvider.tsx'

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      },
      (err) => {
        console.log('Service Worker registration failed:', err);
      }
    );
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
