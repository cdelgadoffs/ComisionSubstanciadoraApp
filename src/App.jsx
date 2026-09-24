import Skeleton from './components/Skeleton.jsx';
import Topbar from './components/L1/Topbar.jsx';
import Sidebar4 from './components/L1/Sidebar4.jsx';
import Sidebar5 from './components/L1/Sidebar5.jsx';
import Inicio from './pages/Inicio.jsx';
import BotonSalirSesion from './components/L3/BotonSalirSesion.jsx';
import { useUI } from './context/UIContext.jsx';
import './styles/L1/L1.css';

function App() {
  const {
    sidebar4Abierto, setSidebar4Abierto,
    sidebar5Abierto, setSidebar5Abierto,
    terminoBusqueda, setTerminoBusqueda,
  } = useUI();

  return (
    <>
      <Skeleton>
        <Topbar
          onToggleSidebar={() => setSidebar5Abierto((a) => !a)}
          terminoBusqueda={terminoBusqueda}
          onCambiarBusqueda={setTerminoBusqueda}
        >
          <BotonSalirSesion />
        </Topbar>
      </Skeleton>
      <Inicio />
      <Sidebar4 abierto={sidebar4Abierto} onCerrar={() => setSidebar4Abierto(false)} />
      <Sidebar5 abierto={sidebar5Abierto} onCerrar={() => setSidebar5Abierto(false)} />
    </>
  );
}

export default App;
