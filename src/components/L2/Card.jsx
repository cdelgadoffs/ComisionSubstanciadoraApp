import '../../styles/L2/Card.css';

export default function Card({ onClick, children }) {
  return (
    <div className={'lvl2-card' + (onClick ? ' lvl2-card-clickable' : '')} onClick={onClick}>
      {children}
    </div>
  );
}
