import BotonS from '../../components/base/BotonS.jsx';
import { useUI } from '../../context/UIContext.jsx';

export default function Quorum() {
  const { setPanelControlActivo } = useUI();

  return (
    <div style={{ margin: '16px 20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ alignSelf: 'flex-start' }}>
        <BotonS onClick={() => setPanelControlActivo(null)}>Volver</BotonS>
      </div>
    </div>
  );
}
