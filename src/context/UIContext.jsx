import { createContext, useContext, useState } from 'react';

const ANCHO_SIDEBAR1 = 270;
const ANCHO_SIDEBAR3 = 500;

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [sidebar3Abierto, setSidebar3Abierto] = useState(false);
  const [sidebar4Abierto, setSidebar4Abierto] = useState(false);
  const [sidebar5Abierto, setSidebar5Abierto] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [vistaActual, setVistaActual] = useState('inicio');

  const izquierdaSidebar1 = 0;
  const izquierdaSidebar3 = izquierdaSidebar1 + ANCHO_SIDEBAR1;
  const panelIzquierda = izquierdaSidebar3 + (sidebar3Abierto ? ANCHO_SIDEBAR3 : 0);

  const value = {
    sidebar3Abierto, setSidebar3Abierto,
    sidebar4Abierto, setSidebar4Abierto,
    sidebar5Abierto, setSidebar5Abierto,
    terminoBusqueda, setTerminoBusqueda,
    vistaActual, setVistaActual,
    izquierdaSidebar1, izquierdaSidebar3, panelIzquierda,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  return useContext(UIContext);
}
