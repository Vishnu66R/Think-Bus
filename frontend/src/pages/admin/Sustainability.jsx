// frontend/src/pages/admin/Sustainability.jsx
// -------------------------------------------
// Sustainability page - environmental metrics.
// Placeholder for now.
// -------------------------------------------

import { Leaf } from "lucide-react";
import "./PlaceholderPage.css";

function Sustainability() {
  return (
    <div className="placeholder-page" id="sustainability-page">
      <div className="placeholder-icon">
        <Leaf size={48} />
      </div>
      <h2 className="placeholder-title">Sustainability</h2>
      <p className="placeholder-text">
        Track carbon footprint reduction, fuel efficiency metrics,
        and environmental impact of the transport network.
      </p>
      <span className="placeholder-badge">Coming Soon</span>
    </div>
  );
}

export default Sustainability;
