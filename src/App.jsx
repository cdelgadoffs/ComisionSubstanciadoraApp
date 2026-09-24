import Skeleton from './components/Skeleton.jsx';
import Sidebar4 from './components/L1/Sidebar4.jsx';
import Inicio from './pages/Inicio.jsx';
import ProyectoOrdenDia from './pages/ProyectoOrdenDia.jsx';
import SesionPrevia from './pages/SesionPrevia.jsx';
import Historial from './pages/Historial.jsx';
import { useUI } from './context/UIContext.jsx';
import './styles/L1/L1.css';

const PAGES = {
  inicio: Inicio,
  proyecto: ProyectoOrdenDia,
  sesionPrevia: SesionPrevia,
  actaSesion: Historial,
};

function App() {
  const { vistaActual, sidebar4Abierto, setSidebar4Abierto } = useUI();
  const Page = PAGES[vistaActual];

  return (
    <>
      <Skeleton>
        {Page && <Page />}
      </Skeleton>
      <Sidebar4 abierto={sidebar4Abierto} onCerrar={() => setSidebar4Abierto(false)} />
    </>
  );
}

export default App;
