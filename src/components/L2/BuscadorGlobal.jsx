import '../../styles/BuscadorGlobal.css';

export default function BuscadorGlobal({ value, onChange, placeholder = 'Buscar...' }) {
  return (
    <div className="l2-buscador-global">
      <input
        type="text"
        className="l2-buscador-global-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <span className="l2-buscador-global-limpiar" onClick={() => onChange('')}>
          ✕
        </span>
      )}
    </div>
  );
}
