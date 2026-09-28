import BotonS from '../base/BotonS.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function BotonSalirSesion() {
  const { cerrarSesion } = useAuth();
  return <BotonS onClick={cerrarSesion}>Salir</BotonS>;
}
