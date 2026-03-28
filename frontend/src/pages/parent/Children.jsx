// frontend/src/pages/parent/Children.jsx
// ----------------------------------------
// Lists all children linked to the parent.
// Clicking a child expands their full details.
// Demonstrates one-to-many parent–child relationship.
// ----------------------------------------

import { useState, useEffect } from "react";
import { fetchParentChildren } from "../../api";
import "./ParentPages.css";

function Children() {
  const [children, setChildren] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username = JSON.parse(localStorage.getItem("thinkbus_user"))?.username || "";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchParentChildren(username);
        if (res.success) {
          setChildren(res.children);
          // Auto-select first child
          if (res.children.length > 0) {
            setSelectedId(res.children[0].id);
          }
        } else {
          setError(res.message || "Failed to load children");
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
      <div className="parent-loading">
        <div className="loading-spinner"></div>
        <p>Loading children…</p>
      </div>
    );
  }
  if (error) return <div className="parent-error">{error}</div>;

  const selected = children.find((c) => c.id === selectedId);

  return (
    <div className="parent-page" id="parent-children">
      <div className="parent-page-header">
        <h2>My Children</h2>
        <p className="parent-page-subtitle">
          {children.length} child{children.length !== 1 ? "ren" : ""} linked to your account
        </p>
      </div>

      <div className="children-panel">
        {/* Left: child list */}
        <div className="children-list-panel">
          {children.map((child) => {
            const isActive = child.id === selectedId;
            const isNormal = child.bus_status === "Active" || child.bus_status === "Normal";
            return (
              <button
                key={child.id}
                className={`child-list-item ${isActive ? "child-list-item--active" : ""}`}
                onClick={() => setSelectedId(child.id)}
              >
                <span className={`status-dot ${isNormal ? "status-dot--green" : "status-dot--red"}`}></span>
                <div className="child-list-info">
                  <span className="child-list-name">{child.full_name}</span>
                  <span className="child-list-meta">{child.department} — {child.semester}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: selected child detail */}
        {selected ? (
          <div className="child-detail-panel">
            <div className="child-detail-header">
              <h3>{selected.full_name}</h3>
              <span className={`status-badge ${
                selected.bus_status === "Active" || selected.bus_status === "Normal"
                  ? "badge--green"
                  : "badge--red"
              }`}>
                {selected.bus_status === "Active" || selected.bus_status === "Normal" ? "Normal" : selected.bus_status}
              </span>
            </div>

            <div className="child-detail-grid">
              <div className="child-detail-item">
                <span className="detail-icon">🎓</span>
                <div>
                  <span className="detail-label">Admission No.</span>
                  <span className="detail-value">{selected.adm_number}</span>
                </div>
              </div>
              <div className="child-detail-item">
                <span className="detail-icon">📚</span>
                <div>
                  <span className="detail-label">Department</span>
                  <span className="detail-value">{selected.department}</span>
                </div>
              </div>
              <div className="child-detail-item">
                <span className="detail-icon">📅</span>
                <div>
                  <span className="detail-label">Semester</span>
                  <span className="detail-value">{selected.semester}</span>
                </div>
              </div>
              <div className="child-detail-item">
                <span className="detail-icon">🚌</span>
                <div>
                  <span className="detail-label">Bus Number</span>
                  <span className="detail-value">{selected.bus_number}</span>
                </div>
              </div>
              <div className="child-detail-item">
                <span className="detail-icon">🛣️</span>
                <div>
                  <span className="detail-label">Route</span>
                  <span className="detail-value">{selected.route_name}</span>
                </div>
              </div>
              <div className="child-detail-item">
                <span className="detail-icon">📍</span>
                <div>
                  <span className="detail-label">Boarding Stop</span>
                  <span className="detail-value">{selected.stop_name}</span>
                </div>
              </div>
              <div className="child-detail-item">
                <span className="detail-icon">👨‍✈️</span>
                <div>
                  <span className="detail-label">Driver</span>
                  <span className="detail-value">{selected.driver_name}</span>
                </div>
              </div>
              <div className="child-detail-item">
                <span className="detail-icon">📞</span>
                <div>
                  <span className="detail-label">Driver Phone</span>
                  <span className="detail-value">{selected.driver_phone}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">👈</span>
            <p>Select a child from the list to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Children;
