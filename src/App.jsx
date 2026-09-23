import { useState } from 'react';
import Skeleton from './components/Skeleton.jsx';
import Topbar from './components/L1/Topbar.jsx';
import Sidebar4 from './components/L1/Sidebar4.jsx';
import Sidebar5 from './components/L1/Sidebar5.jsx';
import Inicio from './pages/Inicio.jsx';
import './styles/L1/L1.css';

const ANCHO_SIDEBAR1 = 270;
const ANCHO_SIDEBAR2 = 250;
const ANCHO_SIDEBAR3 = 500;

function App() {
  const [sidebar1Abierto, setSidebar1Abierto] = useState(true);
  const [sidebar2Abierto, setSidebar2Abierto] = useState(true);
  const [sidebar3Abierto, setSidebar3Abierto] = useState(true);
  const [sidebar4Abierto, setSidebar4Abierto] = useState(false);
  const [sidebar5Abierto, setSidebar5Abierto] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [vistaActual, setVistaActual] = useState('inicio');

  const izquierdaSidebar1 = 0;
  const izquierdaSidebar2 = izquierdaSidebar1 + (sidebar1Abierto ? ANCHO_SIDEBAR1 : 0);
  const izquierdaSidebar3 = izquierdaSidebar2 + (sidebar2Abierto ? ANCHO_SIDEBAR2 : 0);
  const anchoIzquierdo = izquierdaSidebar3 + (sidebar3Abierto ? ANCHO_SIDEBAR3 : 0);

  return (
    <>
      <Skeleton>
        <Topbar
          onToggleSidebar={() => setSidebar5Abierto((a) => !a)}
          terminoBusqueda={terminoBusqueda}
          onCambiarBusqueda={setTerminoBusqueda}
        />
      </Skeleton>
      <Inicio
        sidebar1={{ abierto: sidebar1Abierto, izquierda: izquierdaSidebar1, onCerrar: () => setSidebar1Abierto(false) }}
        sidebar2={{ abierto: sidebar2Abierto, izquierda: izquierdaSidebar2, onCerrar: () => setSidebar2Abierto(false) }}
        sidebar3={{ abierto: sidebar3Abierto, izquierda: izquierdaSidebar3, onCerrar: () => setSidebar3Abierto(false) }}
        panelIzquierda={anchoIzquierdo}
        vistaActual={vistaActual}
        onCambiarVista={setVistaActual}
      />
      <Sidebar4 abierto={sidebar4Abierto} onCerrar={() => setSidebar4Abierto(false)} />
      <Sidebar5 abierto={sidebar5Abierto} onCerrar={() => setSidebar5Abierto(false)} />
    </>
  );
}

export default App;
