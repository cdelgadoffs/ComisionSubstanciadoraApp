export default function Sidebar1({ izquierda = 0, titulo, subtitulo, children }) {
  return (
    <aside className="lvl1-sidebar1" style={{ left: izquierda }}>
      <div className="lvl1-sb-header">
        <div className="lvl1-sb-header-top">
          <div className="lvl1-sb-title">{titulo}</div>
        </div>
        <div className="lvl1-sb-subtitle">{subtitulo}</div>
      </div>
      <nav className="lvl1-sb-nav">{children}</nav>
    </aside>
  );
}
