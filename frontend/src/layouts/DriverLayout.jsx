// frontend/src/layouts/DriverLayout.jsx
// ----------------------------------------
// Layout wrapper for the driver panel.
// ----------------------------------------

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./AdminLayout.css";

import { 
  Route, 
  Compass, 
  ShieldAlert, 
  ClipboardList, 
  RefreshCw, 
  User 
} from "lucide-react";

const DRIVER_NAV_ITEMS = [
  { path: "/driver/route",     label: "My Route",  icon: <Route size={20} /> },
  { path: "/driver/navigate",  label: "Navigate",  icon: <Compass size={20} /> },
  { path: "/driver/emergency", label: "Emergency", icon: <ShieldAlert size={20} /> },
  { path: "/driver/summary",   label: "Summary",   icon: <ClipboardList size={20} /> },
  { path: "/driver/status",    label: "Status",    icon: <RefreshCw size={20} /> },
  { path: "/driver/profile",   label: "Profile",   icon: <User size={20} /> },
];

function DriverLayout({ onLogout, username, theme, onToggleTheme }) {
  return (
    <div className="admin-layout" id="driver-layout">
      <Sidebar
        onLogout={onLogout}
        navItems={DRIVER_NAV_ITEMS}
        brandTitle="ThinkBus"
        brandSubtitle="Driver Panel"
      />
      <div className="admin-main">
        <Header
          title="Driver Panel"
          username={username}
          role="Driver"
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DriverLayout;
