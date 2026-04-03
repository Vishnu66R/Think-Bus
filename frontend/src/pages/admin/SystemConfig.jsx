// frontend/src/pages/admin/SystemConfig.jsx
// -------------------------------------------
// System Configuration page - system settings.
// Placeholder for now.
// -------------------------------------------

import { Settings } from "lucide-react";
import "./PlaceholderPage.css";

function SystemConfig() {
  return (
    <div className="placeholder-page" id="system-config-page">
      <div className="placeholder-icon">
        <Settings size={48} />
      </div>
      <h2 className="placeholder-title">System Configuration</h2>
      <p className="placeholder-text">
        Configure system settings, manage user permissions,
        set up notifications, and customize the admin panel.
      </p>
      <span className="placeholder-badge">Coming Soon</span>
    </div>
  );
}

export default SystemConfig;
