// frontend/src/layouts/ParentLayout.jsx
// ----------------------------------------
// Layout wrapper for the parent panel.
// ----------------------------------------

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./AdminLayout.css";

import { 
  LayoutDashboard, 
  Info, 
  Bell, 
  CreditCard, 
  Baby, 
  User 
} from "lucide-react";

const PARENT_NAV_ITEMS = [
  { path: "/parent/dashboard", label: "Dashboard",   icon: <LayoutDashboard size={20} /> },
  { path: "/parent/bus",       label: "Bus Info",    icon: <Info size={20} /> },
  { path: "/parent/alerts",    label: "Alerts",      icon: <Bell size={20} /> },
  { path: "/parent/fees",      label: "Fees",        icon: <CreditCard size={20} /> },
  { path: "/parent/children",  label: "Children",    icon: <Baby size={20} /> },
  { path: "/parent/profile",   label: "Profile",     icon: <User size={20} /> },
];

function ParentLayout({ onLogout, username, theme, onToggleTheme }) {
  return (
    <div className="admin-layout" id="parent-layout">
      <Sidebar
        onLogout={onLogout}
        navItems={PARENT_NAV_ITEMS}
        brandTitle="ThinkBus"
        brandSubtitle="Parent Panel"
      />
      <div className="admin-main">
        <Header
          title="Parent Portal"
          username={username}
          role="Parent"
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

export default ParentLayout;
