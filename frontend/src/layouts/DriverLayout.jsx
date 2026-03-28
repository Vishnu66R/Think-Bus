// frontend/src/layouts/DriverLayout.jsx
// ----------------------------------------
// Layout wrapper for the driver panel.
// Composes the reusable Sidebar, Header, and page Outlet.
// ----------------------------------------

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./AdminLayout.css"; // Reuse the same layout grid CSS

// Driver-specific navigation items
const DRIVER_NAV_ITEMS = [
  { path: "/driver/route",     label: "My Route",   icon: "🛣️" },
  { path: "/driver/navigate",  label: "Navigate",   icon: "🧭" },
  { path: "/driver/emergency", label: "Emergency",  icon: "🚨" },
  { path: "/driver/summary",   label: "Summary",    icon: "📋" },
  { path: "/driver/status",    label: "Status",     icon: "🔄" },
  { path: "/driver/profile",   label: "Profile",    icon: "👤" },
];

function DriverLayout({ onLogout, username }) {
  return (
    <div className="admin-layout" id="driver-layout">
      {/* Sidebar with driver-specific navigation */}
      <Sidebar
        onLogout={onLogout}
        navItems={DRIVER_NAV_ITEMS}
        brandTitle="ThinkBus"
        brandSubtitle="Driver Panel"
      />

      {/* Main Content Area */}
      <div className="admin-main">
        <Header
          title="Think-Bus"
          username={username}
          role="Driver"
        />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DriverLayout;
