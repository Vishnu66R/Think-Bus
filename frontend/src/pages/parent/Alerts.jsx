// frontend/src/pages/parent/Alerts.jsx
// ----------------------------------------
// Shows notifications like bus rerouting,
// delays, and maintenance alerts.
// Auto-refreshes every 30 seconds.
// ----------------------------------------

import { useState, useEffect } from "react";
import { fetchParentAlerts } from "../../api";
import "./ParentPages.css";

// Icon and color map for alert types
const ALERT_STYLES = {
  danger:  { icon: "🚨", bg: "#fee2e2", border: "#fca5a5", color: "#991b1b" },
  warning: { icon: "⚠️", bg: "#fef3c7", border: "#fde68a", color: "#92400e" },
  info:    { icon: "ℹ️", bg: "#dbeafe", border: "#93c5fd", color: "#1e40af" },
};

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username = JSON.parse(localStorage.getItem("thinkbus_user"))?.username || "";

  async function loadAlerts() {
    try {
      const res = await fetchParentAlerts(username);
      if (res.success) {
        setAlerts(res.alerts);
        setError("");
      } else {
        setError(res.message || "Failed to load alerts");
      }
    } catch {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (username) {
      loadAlerts();
      // Auto-refresh every 30 seconds
      const interval = setInterval(loadAlerts, 30000);
      return () => clearInterval(interval);
    }
  }, [username]);

  if (loading) {
    return (
      <div className="parent-loading">
        <div className="loading-spinner"></div>
        <p>Loading alerts…</p>
      </div>
    );
  }
  if (error) return <div className="parent-error">{error}</div>;

  // Count non-info alerts for badge
  const urgentCount = alerts.filter((a) => a.type !== "info").length;

  return (
    <div className="parent-page" id="parent-alerts">
      <div className="parent-page-header">
        <h2>
          Alerts & Notifications
          {urgentCount > 0 && (
            <span className="alert-badge">{urgentCount}</span>
          )}
        </h2>
        <p className="parent-page-subtitle">Stay updated with bus and transport alerts</p>
      </div>

      {alerts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔔</span>
          <p>No alerts at this time. Everything is running smoothly!</p>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert, idx) => {
            const style = ALERT_STYLES[alert.type] || ALERT_STYLES.info;
            return (
              <div
                className="alert-card"
                key={idx}
                style={{
                  background: style.bg,
                  borderLeft: `4px solid ${style.border}`,
                }}
              >
                <div className="alert-card-icon">{style.icon}</div>
                <div className="alert-card-body">
                  <h4 className="alert-title" style={{ color: style.color }}>
                    {alert.title}
                  </h4>
                  <p className="alert-message">{alert.message}</p>
                  <span className="alert-timestamp">{alert.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Alerts;
