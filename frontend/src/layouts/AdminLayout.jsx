// frontend/src/layouts/AdminLayout.jsx
// -----------------------------------
// Main layout wrapper for the admin panel.
// Composes the Sidebar, Header, and page Outlet.
// -----------------------------------

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./AdminLayout.css";

function AdminLayout({ onLogout, username }) {
  return (
    <div className="admin-layout" id="admin-layout">
      {/* Fixed Sidebar */}
      <Sidebar onLogout={onLogout} />

      {/* Main Content Area (to the right of sidebar) */}
      <div className="admin-main">
        {/* Top Header */}
        <Header username={username} />

        {/* Page Content - dynamically rendered via React Router */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
