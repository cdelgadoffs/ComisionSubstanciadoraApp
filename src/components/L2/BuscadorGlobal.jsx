import '../../styles/L2/BuscadorGlobal.css';

export default function BuscadorGlobal({ value, onChange, placeholder = 'Buscar...' }) {
  return (
    <div className="lvl2-buscador-global">
      <input
        type="text"
        className="lvl2-buscador-global-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <span className="lvl2-buscador-global-limpiar" onClick={() => onChange('')}>
          ✕
        </span>
      )}
    </div>
  );
}
