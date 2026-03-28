// frontend/src/layouts/ParentLayout.jsx
// ----------------------------------------
// Layout wrapper for the parent panel.
// Composes the reusable Sidebar, Header, and page Outlet.
// ----------------------------------------

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./AdminLayout.css"; // Reuse the same layout grid CSS

// Parent-specific navigation items
const PARENT_NAV_ITEMS = [
  { path: "/parent/dashboard", label: "Dashboard",  icon: "📊" },
  { path: "/parent/bus",       label: "Bus Info",    icon: "🚌" },
  { path: "/parent/alerts",    label: "Alerts",      icon: "🔔" },
  { path: "/parent/fees",      label: "Fees",        icon: "💰" },
  { path: "/parent/children",  label: "Children",    icon: "👧" },
  { path: "/parent/profile",   label: "Profile",     icon: "👤" },
];

function ParentLayout({ onLogout, username }) {
  return (
    <div className="admin-layout" id="parent-layout">
      {/* Sidebar with parent-specific navigation */}
      <Sidebar
        onLogout={onLogout}
        navItems={PARENT_NAV_ITEMS}
        brandTitle="ThinkBus"
        brandSubtitle="Parent Panel"
      />

      {/* Main Content Area */}
      <div className="admin-main">
        <Header
          title="Think-Bus"
          username={username}
          role="Parent"
        />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ParentLayout;
