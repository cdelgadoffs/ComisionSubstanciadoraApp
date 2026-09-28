import '../../styles/base/Sidebar1.css';

export default function Sidebar1({ izquierda = 0, arriba = 52, titulo, subtitulo, children }) {
  return (
    <aside className="base-sidebar1" style={{ left: izquierda, top: arriba, height: `calc(100vh - ${arriba}px)` }}>
      <div className="base-sidebar1-header">
        <div className="base-sidebar1-header-top">
          <div className="base-sidebar1-title">{titulo}</div>
        </div>
        <div className="base-sidebar1-subtitle">{subtitulo}</div>
      </div>
      <nav className="base-sidebar1-nav">{children}</nav>
    </aside>
  );
}
