import { useState } from 'react';
import Skeleton from './components/Skeleton.jsx';
import Topbar from './components/L1/Topbar.jsx';
import PanelPrincipal from './components/L1/PanelPrincipal.jsx';
import Sidebar1 from './components/L1/Sidebar1.jsx';
import Sidebar2 from './components/L1/Sidebar2.jsx';
import Sidebar3 from './components/L1/Sidebar3.jsx';
import Sidebar4 from './components/L1/Sidebar4.jsx';
import Sidebar5 from './components/L1/Sidebar5.jsx';
import './styles/L1.css';
import './styles/L2.css';

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
      <PanelPrincipal izquierda={anchoIzquierdo}>
        <span className="l1-panel-principal-placeholder">Panel principal</span>
      </PanelPrincipal>
      <Sidebar1 abierto={sidebar1Abierto} izquierda={izquierdaSidebar1} onCerrar={() => setSidebar1Abierto(false)} />
      <Sidebar2 abierto={sidebar2Abierto} izquierda={izquierdaSidebar2} onCerrar={() => setSidebar2Abierto(false)} />
      <Sidebar3 abierto={sidebar3Abierto} izquierda={izquierdaSidebar3} onCerrar={() => setSidebar3Abierto(false)} />
      <Sidebar4 abierto={sidebar4Abierto} onCerrar={() => setSidebar4Abierto(false)} />
      <Sidebar5 abierto={sidebar5Abierto} onCerrar={() => setSidebar5Abierto(false)} />
    </>
  );
}

export default App;
