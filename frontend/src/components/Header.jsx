// frontend/src/components/Header.jsx
// -----------------------------------
// Reusable top header bar.
// Accepts title, username, role, theme, and onToggleTheme as props.
// -----------------------------------

import { Sun, Moon, User } from "lucide-react";
import "./Header.css";

function Header({
  title = "Think-Bus",
  username = "User",
  role = "Admin",
  theme = "light",
  onToggleTheme,
}) {
  // Pick badge class based on role
  let badgeClass = "topbar-role-badge";
  if (role === "Student") badgeClass += " student";
  else if (role === "Parent") badgeClass += " parent";
  else if (role === "Driver") badgeClass += " driver";

  const isDark = theme === "dark";

  return (
    <header className="admin-topbar" id="app-header">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-right">
        {/* Theme Toggle Button */}
        {onToggleTheme && (
          <button
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
            id="theme-toggle-btn"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}

        {/* User Info */}
        <div className="topbar-user">
          <div className="topbar-avatar">
            <User size={20} />
          </div>
          <span className="topbar-username">{username}</span>
          <span className={badgeClass}>{role}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
