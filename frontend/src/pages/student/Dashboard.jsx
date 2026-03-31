// frontend/src/pages/student/Dashboard.jsx
// -------------------------------------------
// Student Dashboard — shows assigned bus, route, stop, and status.
// Includes auto-refresh polling every 30 seconds for live status.
// -------------------------------------------

import { useEffect, useState, useRef } from "react";
import { fetchStudentDashboard } from "../../api";
import "./StudentDashboard.css";

function Dashboard() {
  const [busInfo, setBusInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const retryCount = useRef(0);

  const username = JSON.parse(localStorage.getItem("thinkbus_user"))?.username || "";

  // Fetch bus status — runs on mount and every 30 seconds
  async function fetchBusStatus() {
    if (!username) return;
    try {
      const res = await fetchStudentDashboard(username);
      if (res.success) {
        setBusInfo(res.data);
        setError("");
        retryCount.current = 0;
        setLoading(false);
      } else {
        if (!busInfo && retryCount.current < 3) {
          retryCount.current++;
          setTimeout(fetchBusStatus, 2000);
        } else {
          setError(res.message || "Failed to load dashboard data");
          setLoading(false);
        }
      }
    } catch (err) {
      console.error(err);
      if (!busInfo && retryCount.current < 3) {
        retryCount.current++;
        setTimeout(fetchBusStatus, 2000);
      } else {
        setError("Error connecting to server");
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchBusStatus();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchBusStatus, 30000);
    return () => clearInterval(interval);
  }, [username]);

  if (loading) {
    return (
      <div className="student-loading">
        <div className="student-spinner"></div>
        <p>{retryCount.current > 0 ? `Retrying connection (${retryCount.current}/3)...` : "Loading your transport details..."}</p>
      </div>
    );
  }

  if (error || !busInfo) {
    return (
      <div className="student-loading">
        <p style={{ color: "#ef4444", fontWeight: "bold" }}>{error || "Profile not linked"}</p>
      </div>
    );
  }

  const isChanged = busInfo.status === "Rerouted" || busInfo.status === "Changed";

  return (
    <div className="student-dashboard" id="student-dashboard-page">
      {/* Page Header */}
      <div className="student-dash-header">
        <h2 className="student-dash-title">Dashboard</h2>
        <p className="student-dash-desc">
          Welcome, <strong>{busInfo.student_name}</strong>! Here's your transport info.
        </p>
      </div>

      {/* Alert Banner — only shows when bus is rerouted */}
      {isChanged && busInfo.alert_message && (
        <div className="student-alert-banner" id="reroute-alert">
          <span className="alert-icon">⚠️</span>
          <span>{busInfo.alert_message}</span>
        </div>
      )}

      {/* Status Cards */}
      <div className="student-cards-grid">
        <div className="student-card">
          <div className="student-card-icon" style={{ background: "#dbeafe", color: "#1d4ed8" }}>🚌</div>
          <div className="student-card-body">
            <span className="student-card-label">Assigned Bus</span>
            <span className="student-card-value">{busInfo.bus_number}</span>
            {busInfo.bus_id && <span className="student-card-sub">Bus #{busInfo.bus_id}</span>}
          </div>
        </div>

        <div className="student-card">
          <div className="student-card-icon" style={{ background: "#dcfce7", color: "#166534" }}>🛣️</div>
          <div className="student-card-body">
            <span className="student-card-label">Route</span>
            <span className="student-card-value">{busInfo.route_name}</span>
          </div>
        </div>

        <div className="student-card">
          <div className="student-card-icon" style={{ background: "#fef3c7", color: "#92400e" }}>📍</div>
          <div className="student-card-body">
            <span className="student-card-label">Boarding Stop</span>
            <span className="student-card-value">{busInfo.stop_name}</span>
          </div>
        </div>

        <div className={`student-card ${isChanged ? "status-changed" : ""}`}>
          <div
            className="student-card-icon"
            style={{
              background: isChanged ? "#fee2e2" : "#dcfce7",
              color: isChanged ? "#991b1b" : "#166534",
            }}
          >
            {isChanged ? "🔄" : "✅"}
          </div>
          <div className="student-card-body">
            <span className="student-card-label">Status</span>
            <span className={`student-card-value ${isChanged ? "text-red" : "text-green"}`}>
              {busInfo.status}
            </span>
          </div>
        </div>
      </div>

      {/* Details Row */}
      <div className="student-details-row">
        {/* Driver Info */}
        <div className="student-detail-card">
          <h3 className="detail-card-title">Driver Details</h3>
          <div className="detail-item">
            <span className="detail-label">Name</span>
            <span className="detail-value">{busInfo.driver_name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Est. Arrival</span>
            <span className="detail-value">{busInfo.estimated_arrival}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Last Updated</span>
            <span className="detail-value">{busInfo.last_updated}</span>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="student-detail-card">
          <h3 className="detail-card-title">Today's Schedule</h3>
          <div className="schedule-timeline">
            {[
              { time: "7:30 AM", event: "Bus departs from Route Start", done: true },
              { time: "7:40 AM", event: `${busInfo.stop_name} (Your Stop)`, done: true, highlight: true },
              { time: "8:00 AM", event: "Approaching College Area", done: false },
              { time: "8:15 AM", event: "Arrives at College Campus", done: false },
            ].map((item, i) => (
              <div className={`schedule-item ${item.done ? "done" : ""} ${item.highlight ? "highlight" : ""}`} key={i}>
                <span className="schedule-dot"></span>
                <div className="schedule-info">
                  <span className="schedule-time">{item.time}</span>
                  <span className="schedule-event">{item.event}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <h3 className="detail-card-title" style={{ marginTop: '30px', fontSize: '1.2rem', color: '#1e293b' }}>Live Bus Tracking</h3>
      <div className="student-map-widget" style={{
        background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '40px',
        textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(#e2e8f0 2px, transparent 2px)', backgroundSize: '20px 20px', opacity: 0.5, zIndex: 1 }}></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🗺️</div>
          <h3 style={{ fontSize: '1.3rem', color: '#1e293b', margin: '0 0 8px' }}>Map View Coming Soon</h3>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Real-time GPS tracking of <strong>{busInfo.bus_number}</strong> will appear here.</p>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
