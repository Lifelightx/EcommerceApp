import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StoreContextProvider } from './ContextApi.jsx'
import NotificationProvider from './NotificationContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreContextProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </StoreContextProvider>
  </StrictMode>,
)
