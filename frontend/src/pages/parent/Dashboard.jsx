// frontend/src/pages/parent/Dashboard.jsx
// ----------------------------------------
// Parent Dashboard — overview of all children,
// their bus status, route, and stop information.
// Auto-refreshes every 30 seconds.
// ----------------------------------------

import { useState, useEffect } from "react";
import { fetchParentDashboard } from "../../api";
import "./ParentPages.css";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get username from localStorage (set during login)
  const username = JSON.parse(localStorage.getItem("thinkbus_user"))?.username || "";

  // Fetch dashboard data
  async function loadDashboard() {
    try {
      const res = await fetchParentDashboard(username);
      if (res.success) {
        setData(res);
        setError("");
      } else {
        setError(res.message || "Failed to load dashboard");
      }
    } catch (e) {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (username) {
      loadDashboard();
      // Auto-refresh every 30 seconds
      const interval = setInterval(loadDashboard, 30000);
      return () => clearInterval(interval);
    }
  }, [username]);

  if (loading) {
    return (
      <div className="parent-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard…</p>
      </div>
    );
  }

  if (error) {
    return <div className="parent-error">{error}</div>;
  }

  return (
    <div className="parent-page" id="parent-dashboard">
      {/* Welcome heading */}
      <div className="parent-page-header">
        <h2>Welcome, {data.parent_name}</h2>
        <p className="parent-page-subtitle">Here's an overview of your children's transport status</p>
      </div>

      {/* Summary cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <span className="summary-icon" style={{ background: "#dbeafe", color: "#2563eb" }}>👧</span>
          <div className="summary-body">
            <span className="summary-value">{data.total_children}</span>
            <span className="summary-label">Total Children</span>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>✅</span>
          <div className="summary-body">
            <span className="summary-value">{data.active_children}</span>
            <span className="summary-label">Active</span>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon" style={{ background: data.rerouted_buses > 0 ? "#fee2e2" : "#f0fdf4", color: data.rerouted_buses > 0 ? "#dc2626" : "#16a34a" }}>
            {data.rerouted_buses > 0 ? "⚠️" : "🟢"}
          </span>
          <div className="summary-body">
            <span className="summary-value">{data.rerouted_buses}</span>
            <span className="summary-label">Rerouted Buses</span>
          </div>
        </div>
      </div>

      {/* Children overview cards */}
      <h3 className="section-title">Children Overview</h3>
      <div className="children-grid">
        {data.children.map((child) => {
          const isNormal = child.bus_status === "Active" || child.bus_status === "Normal";
          return (
            <div
              className={`child-card ${isNormal ? "" : "child-card--alert"}`}
              key={child.id}
            >
              {/* Status indicator */}
              <span className={`status-dot ${isNormal ? "status-dot--green" : "status-dot--red"}`}></span>

              <div className="child-card-header">
                <h4>{child.full_name}</h4>
                <span className={`status-badge ${isNormal ? "badge--green" : "badge--red"}`}>
                  {isNormal ? "Normal" : child.bus_status}
                </span>
              </div>

              <div className="child-card-details">
                <div className="detail-row">
                  <span className="detail-label">Bus</span>
                  <span className="detail-value">{child.bus_number}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Route</span>
                  <span className="detail-value">{child.route_name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Stop</span>
                  <span className="detail-value">{child.stop_name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Dept</span>
                  <span className="detail-value">{child.department} — {child.semester}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
