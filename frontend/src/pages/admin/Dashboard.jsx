// frontend/src/pages/admin/Dashboard.jsx
// ----------------------------------------
// Admin Dashboard - the main landing page.
// Shows overview stats, recent activity, and quick actions.
// ----------------------------------------

import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching dashboard stats from backend
    // Replace with actual API call when backend endpoint is ready:
    //   const res = await fetch('http://localhost:8000/admin/stats');
    //   const data = await res.json();
    const timer = setTimeout(() => {
      setStats({
        totalStudents: 140,
        totalDrivers: 7,
        activeBuses: 7,
        totalRoutes: 7,
        totalParents: 120,
        activeAlerts: 2,
      });
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Stat card configuration
  const statCards = stats
    ? [
        { label: "Total Students",  value: stats.totalStudents,  icon: "🎒", color: "#3b82f6" },
        { label: "Total Drivers",   value: stats.totalDrivers,   icon: "🚗", color: "#10b981" },
        { label: "Active Buses",    value: stats.activeBuses,    icon: "🚌", color: "#f59e0b" },
        { label: "Total Routes",    value: stats.totalRoutes,    icon: "🛣️", color: "#8b5cf6" },
        { label: "Total Parents",   value: stats.totalParents,   icon: "👨‍👧", color: "#06b6d4" },
        { label: "Active Alerts",   value: stats.activeAlerts,   icon: "🔔", color: "#ef4444" },
      ]
    : [];

  // Recent activity (mock data)
  const recentActivity = [
    { id: 1, text: "Bus KL-02-B-2003 reported a breakdown on Route 3",      time: "10 min ago",  type: "alert"   },
    { id: 2, text: "Driver Vishnu Varghese marked attendance",               time: "25 min ago",  type: "info"    },
    { id: 3, text: "7 new students registered for Route 1 (Karunagapally)", time: "1 hr ago",    type: "success" },
    { id: 4, text: "Route 5 (Paripally) schedule updated",                  time: "2 hrs ago",   type: "info"    },
    { id: 5, text: "Maintenance completed for Bus KL-02-B-2006",             time: "3 hrs ago",   type: "success" },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard" id="dashboard-page">
      {/* Page Header */}
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Dashboard</h2>
          <p className="dashboard-desc">Welcome back! Here's an overview of your transport system.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div className="stat-card" key={index} id={`stat-card-${index}`}>
            <div className="stat-icon" style={{ background: `${card.color}15`, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-info">
              <span className="stat-value">{card.value}</span>
              <span className="stat-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Row */}
      <div className="dashboard-row">
        {/* Recent Activity */}
        <div className="dashboard-card activity-card">
          <h3 className="card-title">Recent Activity</h3>
          <ul className="activity-list">
            {recentActivity.map((item) => (
              <li className={`activity-item activity-${item.type}`} key={item.id}>
                <span className="activity-dot"></span>
                <div className="activity-content">
                  <p className="activity-text">{item.text}</p>
                  <span className="activity-time">{item.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions-card">
          <h3 className="card-title">Quick Actions</h3>
          <div className="quick-actions-grid">
            <button className="quick-action-btn" id="qa-add-bus">
              <span className="qa-icon">🚌</span>
              <span>Add New Bus</span>
            </button>
            <button className="quick-action-btn" id="qa-add-route">
              <span className="qa-icon">🛣️</span>
              <span>Add Route</span>
            </button>
            <button className="quick-action-btn" id="qa-manage-drivers">
              <span className="qa-icon">🚗</span>
              <span>Manage Drivers</span>
            </button>
            <button className="quick-action-btn" id="qa-view-reports">
              <span className="qa-icon">📋</span>
              <span>View Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fleet Status Row */}
      <div className="dashboard-card fleet-status-card">
        <h3 className="card-title">Fleet Status Overview</h3>
        <div className="fleet-table-wrapper">
          <table className="fleet-table">
            <thead>
              <tr>
                <th>Bus No.</th>
                <th>Registration</th>
                <th>Route</th>
                <th>Driver</th>
                <th>Capacity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 1, reg: "KL-02-B-2001", route: "Karunagapally", driver: "Unni Suresh",      cap: 50, status: "Active" },
                { id: 2, reg: "KL-02-B-2002", route: "Paravoor",      driver: "Unni Jose",         cap: 50, status: "Active" },
                { id: 3, reg: "KL-02-B-2003", route: "Mevarom",       driver: "Syam Kurian",       cap: 50, status: "Breakdown" },
                { id: 4, reg: "KL-02-B-2004", route: "Kottiyam",      driver: "Unni Pillai",       cap: 50, status: "Active" },
                { id: 5, reg: "KL-02-B-2005", route: "Paripally",     driver: "Vishnu Varghese",   cap: 50, status: "Active" },
                { id: 6, reg: "KL-02-B-2006", route: "Kottarakkara",  driver: "Akhil Santhosh",    cap: 50, status: "Maintenance" },
                { id: 7, reg: "KL-02-B-2007", route: "Cheerankavu",   driver: "Jijo Prakash",      cap: 50, status: "Active" },
              ].map((bus) => (
                <tr key={bus.id}>
                  <td>Bus {bus.id}</td>
                  <td>{bus.reg}</td>
                  <td>{bus.route}</td>
                  <td>{bus.driver}</td>
                  <td>{bus.cap}</td>
                  <td>
                    <span className={`status-badge status-${bus.status.toLowerCase()}`}>
                      {bus.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
