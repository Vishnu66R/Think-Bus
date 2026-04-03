// frontend/src/pages/driver/Status.jsx
// ----------------------------------------
// Allows the driver to view and update
// their bus status (Active, Idle, Maintenance).
// ----------------------------------------

import { useState, useEffect } from "react";
import { 
  CheckCircle, 
  Clock, 
  Wrench, 
  AlertOctagon, 
  XCircle 
} from "lucide-react";
import { fetchDriverStatus, updateDriverStatus } from "../../api";
import "./DriverPages.css";

// Status options with colors
const STATUS_OPTIONS = [
  { value: "Active",      icon: <CheckCircle size={24} />,    color: "#16a34a", bg: "#dcfce7", label: "Active — On Route" },
  { value: "Idle",        icon: <Clock size={24} />,          color: "#d97706", bg: "#fef3c7", label: "Idle — Waiting" },
  { value: "Maintenance", icon: <Wrench size={24} />,         color: "#6366f1", bg: "#eef2ff", label: "Maintenance — Under Repair" },
  { value: "Breakdown",   icon: <AlertOctagon size={24} />,    color: "#dc2626", bg: "#fee2e2", label: "Breakdown — Out of Service" },
];

function Status() {
  const [currentStatus, setCurrentStatus] = useState("");
  const [busNumber, setBusNumber] = useState("—");
  const [driverName, setDriverName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState("");

  const username = JSON.parse(localStorage.getItem("thinkbus_user"))?.username || "";

  // Load current status
  async function loadStatus() {
    try {
      const res = await fetchDriverStatus(username);
      if (res.success) {
        setCurrentStatus(res.status);
        setBusNumber(res.bus_number);
        setDriverName(res.driver_name || "");
        setError("");
      } else {
        setError(res.message || "Failed to load status");
      }
    } catch {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (username) {
      loadStatus();
      const interval = setInterval(loadStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [username]);

  // Update status
  async function handleStatusChange(newStatus) {
    if (newStatus === currentStatus) return;
    setUpdating(true);
    setMessage(null);
    try {
      const res = await updateDriverStatus(username, newStatus);
      if (res.success) {
        setCurrentStatus(newStatus);
        setMessage({ type: "success", text: res.message });
      } else {
        setMessage({ type: "error", text: res.message });
      }
    } catch {
      setMessage({ type: "error", text: "Could not connect to server" });
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="driver-loading">
        <div className="loading-spinner"></div>
        <p>Loading status…</p>
      </div>
    );
  }
  if (error) return <div className="driver-error">{error}</div>;

  const activeOption = STATUS_OPTIONS.find((s) => s.value === currentStatus) || STATUS_OPTIONS[0];

  return (
    <div className="driver-page" id="driver-status">
      <div className="driver-page-header">
        <h2>Bus Status</h2>
        <p className="driver-page-subtitle">Update your current bus status</p>
      </div>

      {/* Current status display */}
      <div className="status-current-card" style={{ background: activeOption.bg, borderColor: activeOption.color }}>
        <span className="status-current-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {activeOption.icon}
        </span>
        <div className="status-current-info">
          <span className="status-current-label">Current Status</span>
          <span className="status-current-value" style={{ color: activeOption.color }}>
            {activeOption.label}
          </span>
          <span className="status-current-bus">Bus: {busNumber}</span>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`status-message ${message.type === "success" ? "msg--success" : "msg--error"}`}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {message.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
            {message.text}
          </span>
        </div>
      )}

      {/* Status selection buttons */}
      <h3 className="section-title">Change Status</h3>
      <div className="status-options">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`status-option-btn ${currentStatus === opt.value ? "status-option--active" : ""}`}
            style={{
              borderColor: currentStatus === opt.value ? opt.color : "#e2e8f0",
              background: currentStatus === opt.value ? opt.bg : "#ffffff",
            }}
            onClick={() => handleStatusChange(opt.value)}
            disabled={updating || currentStatus === opt.value}
          >
            <span className="status-opt-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {opt.icon}
            </span>
            <span className="status-opt-label" style={{ color: currentStatus === opt.value ? opt.color : "#334155" }}>
              {opt.value}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Status;
