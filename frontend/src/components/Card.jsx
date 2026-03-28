// frontend/src/components/Card.jsx
// -----------------------------------
// Reusable card component for dashboard-style layouts.
// Used by both admin and student pages.
// -----------------------------------

import "./Card.css";

function Card({ icon, title, value, subtitle, color = "#3b82f6", children }) {
  return (
    <div className="info-card">
      {/* If icon/value provided, show stat-style card */}
      {icon && (
        <div className="info-card-icon" style={{ background: `${color}15`, color }}>
          {icon}
        </div>
      )}
      <div className="info-card-body">
        {value && <span className="info-card-value">{value}</span>}
        {title && <span className="info-card-title">{title}</span>}
        {subtitle && <span className="info-card-subtitle">{subtitle}</span>}
        {children}
      </div>
    </div>
  );
}

export default Card;
