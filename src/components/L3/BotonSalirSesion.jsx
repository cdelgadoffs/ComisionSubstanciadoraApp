import BotonS from '../L2/BotonS.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function BotonSalirSesion() {
  const { cerrarSesion } = useAuth();
  return <BotonS onClick={cerrarSesion}>Salir</BotonS>;
}
