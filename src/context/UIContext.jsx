import { createContext, useContext, useState } from 'react';

export const ANCHO_SIDEBAR1 = 270;
export const ANCHO_SIDEBAR2 = 250;
export const ANCHO_SIDEBAR3 = 500;
export const ALTO_TOPBAR = 52;
export const ALTO_CINTA = 50;

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [sidebar2Abierto, setSidebar2Abierto] = useState(true);
  const [sidebar3Abierto, setSidebar3Abierto] = useState(false);
  const [sidebar4Abierto, setSidebar4Abierto] = useState(false);
  const [sidebar5Abierto, setSidebar5Abierto] = useState(false);
  const [sidebar5Ancho, setSidebar5Ancho] = useState(false);
  const [panelControlActivo, setPanelControlActivo] = useState(null);
  const [mostrarFormularioCalendario, setMostrarFormularioCalendario] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [vistaActual, setVistaActual] = useState('inicio');
  const [acordeonAbierto, setAcordeonAbierto] = useState(false);

  const izquierdaSidebar1 = 0;
  const izquierdaSidebar2 = izquierdaSidebar1 + ANCHO_SIDEBAR1;
  const izquierdaSidebar3 = izquierdaSidebar1 + ANCHO_SIDEBAR1;

  function toggleSidebar5() {
    if (sidebar5Abierto) {
      setPanelControlActivo(null);
      setMostrarFormularioCalendario(true);
    }
    setSidebar5Abierto((a) => !a);
  }
  function cerrarSidebar5() {
    setSidebar5Abierto(false);
    setPanelControlActivo(null);
    setMostrarFormularioCalendario(true);
  }

  const value = {
    sidebar2Abierto, setSidebar2Abierto,
    sidebar3Abierto, setSidebar3Abierto,
    sidebar4Abierto, setSidebar4Abierto,
    sidebar5Abierto, toggleSidebar5, cerrarSidebar5,
    sidebar5Ancho, setSidebar5Ancho,
    panelControlActivo, setPanelControlActivo,
    mostrarFormularioCalendario, setMostrarFormularioCalendario,
    terminoBusqueda, setTerminoBusqueda,
    vistaActual, setVistaActual,
    acordeonAbierto, setAcordeonAbierto,
    izquierdaSidebar1, izquierdaSidebar2, izquierdaSidebar3,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  return useContext(UIContext);
}
