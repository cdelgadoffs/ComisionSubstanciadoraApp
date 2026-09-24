import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LoginGate from './pages/LoginGate.jsx'
import BloqueadoGate from './pages/BloqueadoGate.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProyectoProvider } from './context/ProyectoContext.jsx'
import { UIProvider } from './context/UIContext.jsx'

const vista = new URLSearchParams(window.location.search).get('pwvista')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProyectoProvider>
        <UIProvider>
          {vista === 'login' ? <LoginGate /> : vista === 'bloqueado' ? <BloqueadoGate /> : <App />}
        </UIProvider>
      </ProyectoProvider>
    </AuthProvider>
  </StrictMode>,
)
