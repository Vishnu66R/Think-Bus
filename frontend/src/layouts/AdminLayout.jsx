// frontend/src/layouts/AdminLayout.jsx
// -----------------------------------
// Main layout wrapper for the admin panel.
// Composes the Sidebar, Header, and page Outlet.
// -----------------------------------

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./AdminLayout.css";

function AdminLayout({ onLogout, username, theme, onToggleTheme }) {
  return (
    <div className="admin-layout" id="admin-layout">
      <Sidebar onLogout={onLogout} />
      <div className="admin-main">
        <Header
          title="Admin Dashboard"
          username={username}
          role="Admin"
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

export default AdminLayout;
