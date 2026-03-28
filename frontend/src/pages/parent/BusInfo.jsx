// frontend/src/pages/parent/BusInfo.jsx
// ----------------------------------------
// Detailed bus, route, stop, and driver info
// for every child linked to the parent.
// ----------------------------------------

import { useState, useEffect } from "react";
import { fetchParentBusInfo } from "../../api";
import "./ParentPages.css";

function BusInfo() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username = JSON.parse(localStorage.getItem("thinkbus_user"))?.username || "";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchParentBusInfo(username);
        if (res.success) {
          setChildren(res.children);
        } else {
          setError(res.message || "Failed to load bus info");
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
        <p>Loading bus information…</p>
      </div>
    );
  }
  if (error) return <div className="parent-error">{error}</div>;

  return (
    <div className="parent-page" id="parent-bus-info">
      <div className="parent-page-header">
        <h2>Bus Information</h2>
        <p className="parent-page-subtitle">Detailed transport information for each child</p>
      </div>

      <div className="bus-info-list">
        {children.map((child) => {
          const isNormal = child.bus_status === "Active" || child.bus_status === "Normal";
          return (
            <div className="bus-info-card" key={child.id}>
              <div className="bus-info-header">
                <h3>{child.full_name}</h3>
                <span className={`status-badge ${isNormal ? "badge--green" : "badge--red"}`}>
                  {isNormal ? "Active" : child.bus_status}
                </span>
              </div>

              <div className="bus-info-grid">
                {/* Bus Details */}
                <div className="bus-info-section">
                  <h4 className="bus-info-section-title">🚌 Bus Details</h4>
                  <div className="info-row">
                    <span className="info-label">Bus Number</span>
                    <span className="info-value">{child.bus_number}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Status</span>
                    <span className={`info-value ${isNormal ? "text-green" : "text-red"}`}>
                      {child.bus_status}
                    </span>
                  </div>
                </div>

                {/* Route Details */}
                <div className="bus-info-section">
                  <h4 className="bus-info-section-title">🛣️ Route Details</h4>
                  <div className="info-row">
                    <span className="info-label">Route</span>
                    <span className="info-value">{child.route_name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Boarding Stop</span>
                    <span className="info-value">{child.stop_name}</span>
                  </div>
                </div>

                {/* Driver Details */}
                <div className="bus-info-section">
                  <h4 className="bus-info-section-title">👨‍✈️ Driver Info</h4>
                  <div className="info-row">
                    <span className="info-label">Driver Name</span>
                    <span className="info-value">{child.driver_name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Driver Phone</span>
                    <span className="info-value">{child.driver_phone}</span>
                  </div>
                </div>

                {/* Student Details */}
                <div className="bus-info-section">
                  <h4 className="bus-info-section-title">🎓 Student Info</h4>
                  <div className="info-row">
                    <span className="info-label">Adm. Number</span>
                    <span className="info-value">{child.adm_number}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Department</span>
                    <span className="info-value">{child.department} — {child.semester}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BusInfo;
