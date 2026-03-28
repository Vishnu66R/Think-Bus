// frontend/src/pages/driver/Emergency.jsx
// ----------------------------------------
// Emergency reporting page with large buttons
// for breakdown, delay, and traffic issues.
// Includes confirmation popup before sending.
// ----------------------------------------

import { useState } from "react";
import { reportEmergency } from "../../api";
import "./DriverPages.css";

// Emergency types with styling
const EMERGENCY_TYPES = [
  {
    type: "breakdown",
    label: "Bus Breakdown",
    icon: "🔧",
    color: "#dc2626",
    bg: "#fee2e2",
    description: "Bus cannot move. Needs immediate attention.",
  },
  {
    type: "delay",
    label: "Delay",
    icon: "⏱️",
    color: "#d97706",
    bg: "#fef3c7",
    description: "Running behind schedule due to unforeseen reasons.",
  },
  {
    type: "traffic",
    label: "Traffic Issue",
    icon: "🚧",
    color: "#ea580c",
    bg: "#fff7ed",
    description: "Heavy traffic causing significant delays.",
  },
];

function Emergency() {
  const [confirming, setConfirming] = useState(null); // which type is being confirmed
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null); // { success, message }

  const username = JSON.parse(localStorage.getItem("thinkbus_user"))?.username || "";

  // Show confirmation popup
  function handleClick(type) {
    setConfirming(type);
    setResult(null);
  }

  // Cancel confirmation
  function handleCancel() {
    setConfirming(null);
  }

  // Send emergency report
  async function handleConfirm() {
    if (!confirming) return;
    setSending(true);
    try {
      const res = await reportEmergency(username, confirming.type, confirming.description);
      setResult(res);
    } catch {
      setResult({ success: false, message: "Could not connect to server" });
    } finally {
      setSending(false);
      setConfirming(null);
    }
  }

  return (
    <div className="driver-page" id="driver-emergency">
      <div className="driver-page-header">
        <h2>🚨 Emergency Report</h2>
        <p className="driver-page-subtitle">Tap a button to report an issue immediately</p>
      </div>

      {/* Result message */}
      {result && (
        <div className={`emergency-result ${result.success ? "result--success" : "result--error"}`}>
          <span>{result.success ? "✅" : "❌"}</span>
          <span>{result.message}</span>
        </div>
      )}

      {/* Emergency buttons */}
      <div className="emergency-grid">
        {EMERGENCY_TYPES.map((item) => (
          <button
            key={item.type}
            className="emergency-btn"
            style={{ borderColor: item.color, background: item.bg }}
            onClick={() => handleClick(item)}
          >
            <span className="emergency-btn-icon">{item.icon}</span>
            <span className="emergency-btn-label" style={{ color: item.color }}>
              {item.label}
            </span>
            <span className="emergency-btn-desc">{item.description}</span>
          </button>
        ))}
      </div>

      {/* Confirmation modal */}
      {confirming && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-icon">{confirming.icon}</div>
            <h3 className="modal-title">Confirm Emergency Report</h3>
            <p className="modal-message">
              Are you sure you want to report a <strong>{confirming.label}</strong>?
              This will notify the admin immediately.
            </p>
            <div className="modal-buttons">
              <button className="modal-btn modal-btn--cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className="modal-btn modal-btn--confirm"
                onClick={handleConfirm}
                disabled={sending}
                style={{ background: confirming.color }}
              >
                {sending ? "Sending…" : "Yes, Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Emergency;
