// frontend/src/pages/parent/BusInfo.jsx
// ----------------------------------------
// Detailed bus, route, stop, and driver info
// for every child linked to the parent.
// ----------------------------------------

import { useState, useEffect, useRef } from "react";
import { fetchParentBusInfo } from "../../api";
import "./ParentPages.css";

function BusInfo() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const retryCount = useRef(0);

  const username = JSON.parse(localStorage.getItem("thinkbus_user"))?.username || "";

  async function load() {
    if (!username) return;
    try {
      const res = await fetchParentBusInfo(username);
      if (res.success) {
        setChildren(res.children);
        setError("");
        retryCount.current = 0;
        setLoading(false);
      } else {
        if (children.length === 0 && retryCount.current < 3) {
          retryCount.current++;
          setTimeout(load, 2000);
        } else {
          setError(res.message || "Failed to load bus info");
          setLoading(false);
        }
      }
    } catch {
      if (children.length === 0 && retryCount.current < 3) {
        retryCount.current++;
        setTimeout(load, 2000);
      } else {
        setError("Could not connect to server");
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    load();
  }, [username]);

  if (loading) {
    return (
      <div className="parent-loading">
        <div className="loading-spinner"></div>
        <p>{retryCount.current > 0 ? `Retrying connection (${retryCount.current}/3)...` : "Loading bus information..."}</p>
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
                  <button 
                    onClick={() => alert(`Initiating secure call to ${child.driver_name} (${child.driver_phone})... \n\n[Dummy functionality]}`)} 
                    style={{ 
                      marginTop: '12px', width: '100%', padding: '10px', 
                      background: '#e0e7ff', color: '#4f46e5', border: '1px solid #c7d2fe', 
                      borderRadius: '8px', cursor: 'pointer', fontWeight: '600',
                      transition: 'background 0.2s', fontFamily: 'Inter, sans-serif'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#c7d2fe'}
                    onMouseOut={(e) => e.target.style.background = '#e0e7ff'}
                  >
                    📞 Call Driver
                  </button>
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
