// frontend/src/layouts/StudentLayout.jsx
// ----------------------------------------
// Layout wrapper for the student panel.
// Composes the reusable Sidebar, Header, and page Outlet.
// ----------------------------------------

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../layouts/AdminLayout.css"; // Reuse the same layout grid CSS

// Student-specific navigation items
const STUDENT_NAV_ITEMS = [
  { path: "/student/dashboard",     label: "Dashboard",     icon: "📊" },
  { path: "/student/pass",          label: "My Bus Pass",   icon: "🎫" },
  { path: "/student/planner",       label: "Planner",       icon: "🗺️" },
  { path: "/student/notifications", label: "Notifications", icon: "🔔" },
  { path: "/student/profile",       label: "Profile",       icon: "👤" },
];

function StudentLayout({ onLogout, username }) {
  return (
    <div className="admin-layout" id="student-layout">
      {/* Sidebar with student-specific navigation */}
      <Sidebar
        onLogout={onLogout}
        navItems={STUDENT_NAV_ITEMS}
        brandTitle="ThinkBus"
        brandSubtitle="Student Panel"
      />

      {/* Main Content Area */}
      <div className="admin-main">
        <Header
          title="Think-Bus"
          username={username}
          role="Student"
        />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;
