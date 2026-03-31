// frontend/src/pages/driver/Navigate.jsx
// ----------------------------------------
// Step-by-step navigation view showing route progression.
// Driver can mark stops as reached.
// ----------------------------------------

import { useState, useEffect } from "react";
import { fetchDriverNavigation } from "../../api";
import "./DriverPages.css";

function Navigate() {
  const [data, setData] = useState(null);
  const [currentStopIdx, setCurrentStopIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username = JSON.parse(localStorage.getItem("thinkbus_user"))?.username || "";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchDriverNavigation(username);
        if (res.success) {
          setData(res);
        } else {
          setError(res.message || "Failed to load navigation");
        }
      } catch {
        setError("Could not connect to server");
      } finally {
        setLoading(false);
      }
    }
    if (username) load();
  }, [username]);

  if (loading) {
    return (
      <div className="driver-loading">
        <div className="loading-spinner"></div>
        <p>Loading navigation…</p>
      </div>
    );
  }
  if (error) return <div className="driver-error">{error}</div>;
  if (!data?.route || !data?.stops?.length) {
    return (
      <div className="driver-page">
        <div className="empty-state">
          <span className="empty-icon">🧭</span>
          <p>No route data available for navigation.</p>
        </div>
      </div>
    );
  }

  const stops = data.stops;
  const currentStop = stops[currentStopIdx];
  const nextStop = stops[currentStopIdx + 1] || null;
  const progress = Math.round(((currentStopIdx + 1) / stops.length) * 100);

  // Move to next stop
  function handleNextStop() {
    if (currentStopIdx < stops.length - 1) {
      setCurrentStopIdx(currentStopIdx + 1);
    }
  }

  // Move to previous stop
  function handlePrevStop() {
    if (currentStopIdx > 0) {
      setCurrentStopIdx(currentStopIdx - 1);
    }
  }

  return (
    <div className="driver-page" id="driver-navigate">
      <div className="driver-page-header">
        <h2>Navigation</h2>
        <p className="driver-page-subtitle">{data.route.name} — Step-by-step</p>
      </div>

      {/* Progress bar */}
      <div className="nav-progress-bar">
        <div className="nav-progress-fill" style={{ width: `${progress}%` }}></div>
        <span className="nav-progress-text">{progress}% Complete</span>
      </div>

      {/* Current stop highlight */}
      <div className="nav-current-card">
        <div className="nav-current-label">CURRENT STOP</div>
        <h3 className="nav-current-name">{currentStop.name}</h3>
        <span className="nav-current-meta">Stop {currentStopIdx + 1} of {stops.length} · {currentStop.time_from_start} min</span>
      </div>

      {/* Next stop */}
      {nextStop && (
        <div className="nav-next-card">
          <span className="nav-next-label">NEXT →</span>
          <span className="nav-next-name">{nextStop.name}</span>
          <span className="nav-next-time">{nextStop.time_from_start - currentStop.time_from_start} min away</span>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="nav-buttons">
        <button
          className="nav-btn nav-btn--prev"
          onClick={handlePrevStop}
          disabled={currentStopIdx === 0}
        >
          ← Previous
        </button>
        <button
          className="nav-btn nav-btn--next"
          onClick={handleNextStop}
          disabled={currentStopIdx >= stops.length - 1}
        >
          {currentStopIdx >= stops.length - 1 ? "Trip Complete ✅" : "Next Stop →"}
        </button>
      </div>

      {/* All stops mini list */}
      <h3 className="section-title">All Stops</h3>
      <div className="nav-stops-list">
        {stops.map((stop, idx) => (
          <div
            className={`nav-stop-item ${
              idx < currentStopIdx ? "nav-stop--done" :
              idx === currentStopIdx ? "nav-stop--current" : "nav-stop--upcoming"
            }`}
            key={stop.id}
          >
            <span className="nav-stop-indicator">
              {idx < currentStopIdx ? "✅" : idx === currentStopIdx ? "📍" : "⬜"}
            </span>
            <span className="nav-stop-name">{stop.name}</span>
            <span className="nav-stop-time">{stop.time_from_start} min</span>
          </div>
        ))}
      </div>

      {/* Map Placeholder */}
      <h3 className="section-title" style={{ marginTop: '30px', fontSize: '1.2rem', color: '#1e293b' }}>Live Navigation Map</h3>
      <div className="driver-map-widget" style={{
        background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '40px',
        textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(#e2e8f0 2px, transparent 2px)', backgroundSize: '20px 20px', opacity: 0.5, zIndex: 1 }}></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🗺️</div>
          <h3 style={{ fontSize: '1.3rem', color: '#1e293b', margin: '0 0 8px' }}>Turn-by-Turn GPS Coming Soon</h3>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>An interactive map guiding you seamlessly to <strong>{nextStop ? nextStop.name : data.route.end_point}</strong> will appear here.</p>
        </div>
      </div>
    </div>
  );
}

export default Navigate;
