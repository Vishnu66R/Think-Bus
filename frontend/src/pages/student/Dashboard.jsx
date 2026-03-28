// frontend/src/pages/student/Dashboard.jsx
// -------------------------------------------
// Student Dashboard — shows assigned bus, route, stop, and status.
// Includes auto-refresh polling every 30 seconds for live status.
// -------------------------------------------

import { useEffect, useState } from "react";
import "./StudentDashboard.css";

function Dashboard() {
  const [busInfo, setBusInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch bus status — runs on mount and every 30 seconds
  useEffect(() => {
    function fetchBusStatus() {
      // Mock data matching real DB (student: Shreyas Menon, Route 1, Bus 1)
      // Replace with: const res = await fetch('http://localhost:8000/student/bus-status');
      setTimeout(() => {
        setBusInfo({
          studentName: "Shreyas Menon",
          busNumber: "KL-02-B-2001",
          busId: 1,
          routeName: "Karunagapally",
          stopName: "Kuttivattom",
          driverName: "Unni Suresh",
          status: "Normal",       // "Normal" or "Changed"
          estimatedArrival: "8:15 AM",
          lastUpdated: new Date().toLocaleTimeString(),
          alertMessage: null,     // Set text when rerouted
        });
        setLoading(false);
      }, 500);
    }

    fetchBusStatus();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchBusStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="student-loading">
        <div className="student-spinner"></div>
        <p>Loading your bus details...</p>
      </div>
    );
  }

  const isChanged = busInfo.status === "Changed";

  return (
    <div className="student-dashboard" id="student-dashboard-page">
      {/* Page Header */}
      <div className="student-dash-header">
        <h2 className="student-dash-title">Dashboard</h2>
        <p className="student-dash-desc">
          Welcome, <strong>{busInfo.studentName}</strong>! Here's your transport info.
        </p>
      </div>

      {/* Alert Banner — only shows when bus is rerouted */}
      {isChanged && busInfo.alertMessage && (
        <div className="student-alert-banner" id="reroute-alert">
          <span className="alert-icon">⚠️</span>
          <span>{busInfo.alertMessage}</span>
        </div>
      )}

      {/* Status Cards */}
      <div className="student-cards-grid">
        <div className="student-card">
          <div className="student-card-icon" style={{ background: "#dbeafe", color: "#1d4ed8" }}>🚌</div>
          <div className="student-card-body">
            <span className="student-card-label">Assigned Bus</span>
            <span className="student-card-value">{busInfo.busNumber}</span>
            <span className="student-card-sub">Bus #{busInfo.busId}</span>
          </div>
        </div>

        <div className="student-card">
          <div className="student-card-icon" style={{ background: "#dcfce7", color: "#166534" }}>🛣️</div>
          <div className="student-card-body">
            <span className="student-card-label">Route</span>
            <span className="student-card-value">{busInfo.routeName}</span>
          </div>
        </div>

        <div className="student-card">
          <div className="student-card-icon" style={{ background: "#fef3c7", color: "#92400e" }}>📍</div>
          <div className="student-card-body">
            <span className="student-card-label">Boarding Stop</span>
            <span className="student-card-value">{busInfo.stopName}</span>
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
            <span className="detail-value">{busInfo.driverName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Est. Arrival</span>
            <span className="detail-value">{busInfo.estimatedArrival}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Last Updated</span>
            <span className="detail-value">{busInfo.lastUpdated}</span>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="student-detail-card">
          <h3 className="detail-card-title">Today's Schedule</h3>
          <div className="schedule-timeline">
            {[
              { time: "7:30 AM", event: "Bus departs from Karunagapally", done: true },
              { time: "7:40 AM", event: "Kuttivattom (Your Stop)", done: true, highlight: true },
              { time: "8:00 AM", event: "Chavara", done: false },
              { time: "8:15 AM", event: "Arrives at College", done: false },
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
    </div>
  );
}

export default Dashboard;
