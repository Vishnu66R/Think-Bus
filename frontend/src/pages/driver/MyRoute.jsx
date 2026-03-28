// frontend/src/pages/driver/MyRoute.jsx
// ----------------------------------------
// Shows the driver's assigned route with all stops in order.
// Auto-refreshes every 30 seconds.
// ----------------------------------------

import { useState, useEffect } from "react";
import { fetchDriverRoute } from "../../api";
import "./DriverPages.css";

function MyRoute() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username = JSON.parse(localStorage.getItem("thinkbus_user"))?.username || "";

  async function loadRoute() {
    try {
      const res = await fetchDriverRoute(username);
      if (res.success) {
        setData(res);
        setError("");
      } else {
        setError(res.message || "Failed to load route");
      }
    } catch {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (username) {
      loadRoute();
      const interval = setInterval(loadRoute, 30000);
      return () => clearInterval(interval);
    }
  }, [username]);

  if (loading) {
    return (
      <div className="driver-loading">
        <div className="loading-spinner"></div>
        <p>Loading route…</p>
      </div>
    );
  }
  if (error) return <div className="driver-error">{error}</div>;
  if (!data?.route) {
    return (
      <div className="driver-page">
        <div className="empty-state">
          <span className="empty-icon">🛣️</span>
          <p>No route assigned yet. Please contact admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-page" id="driver-my-route">
      <div className="driver-page-header">
        <h2>My Route</h2>
        <p className="driver-page-subtitle">Your assigned route and stops</p>
      </div>

      {/* Route overview card */}
      <div className="route-overview-card">
        <div className="route-overview-row">
          <div className="route-info-block">
            <span className="route-info-label">Route</span>
            <span className="route-info-value">{data.route.name}</span>
          </div>
          <div className="route-info-block">
            <span className="route-info-label">Bus</span>
            <span className="route-info-value">{data.bus_number}</span>
          </div>
          <div className="route-info-block">
            <span className="route-info-label">Duration</span>
            <span className="route-info-value">{data.route.estimated_duration} min</span>
          </div>
          <div className="route-info-block">
            <span className="route-info-label">Status</span>
            <span className={`route-status-badge status--${data.bus_status.toLowerCase()}`}>
              {data.bus_status}
            </span>
          </div>
        </div>

        <div className="route-endpoints">
          <span className="endpoint start-point">📍 {data.route.start_point}</span>
          <span className="endpoint-arrow">→</span>
          <span className="endpoint end-point">🏁 {data.route.end_point}</span>
        </div>
      </div>

      {/* Stops list */}
      <h3 className="section-title">Stops ({data.stops.length})</h3>
      <div className="stops-timeline">
        {data.stops.map((stop, idx) => (
          <div className="stop-item" key={stop.id}>
            <div className="stop-number">{idx + 1}</div>
            <div className="stop-connector">
              <div className="stop-dot"></div>
              {idx < data.stops.length - 1 && <div className="stop-line"></div>}
            </div>
            <div className="stop-info">
              <span className="stop-name">{stop.name}</span>
              <span className="stop-time">{stop.time_from_start} min from start</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyRoute;
