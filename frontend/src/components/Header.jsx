// frontend/src/components/Header.jsx
// -----------------------------------
// Reusable top header bar.
// Accepts title, username, and role as props.
// -----------------------------------

import "./Header.css";

function Header({ title = "Think-Bus Admin", username = "Admin", role = "Admin" }) {
  // Pick badge color based on role
  let badgeClass = "topbar-role-badge";
  if (role === "Student") badgeClass += " student";
  else if (role === "Parent") badgeClass += " parent";
  else if (role === "Driver") badgeClass += " driver";

  return (
    <header className="admin-topbar" id="app-header">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
      </div>
      <div className="topbar-right">
        <div className="topbar-user">
          <span className="topbar-avatar">👤</span>
          <span className="topbar-username">{username}</span>
          <span className={badgeClass}>{role}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
