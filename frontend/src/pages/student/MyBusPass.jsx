// frontend/src/pages/student/MyBusPass.jsx
// -------------------------------------------
// Digital Bus Pass page — shows a styled pass card
// with the student's bus assignment details.
// -------------------------------------------

import { useState, useEffect } from "react";
import "./MyBusPass.css";

function MyBusPass() {
  const [passData, setPassData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data — replace with API call later
    setTimeout(() => {
      setPassData({
        studentName: "Shreyas Menon",
        admNumber: "CE241000",
        department: "CE",
        semester: "S4",
        busNumber: "KL-02-B-2001",
        busId: 1,
        routeName: "Karunagapally",
        stopName: "Kuttivattom",
        validUntil: "June 2026",
        isActive: true,
      });
      setLoading(false);
    }, 400);
  }, []);

  if (loading) {
    return (
      <div className="student-loading">
        <div className="student-spinner"></div>
        <p>Loading your bus pass...</p>
      </div>
    );
  }

  return (
    <div className="bus-pass-page" id="bus-pass-page">
      <div className="bus-pass-header">
        <h2 className="bus-pass-page-title">My Bus Pass</h2>
        <p className="bus-pass-page-desc">Your digital bus pass for the current semester.</p>
      </div>

      {/* The Digital Pass Card */}
      <div className="bus-pass-card">
        {/* Card Header */}
        <div className="pass-card-top">
          <div className="pass-brand">
            <span className="pass-logo">🚌</span>
            <div>
              <h3 className="pass-college">College of Engineering, Perumon</h3>
              <span className="pass-system">ThinkBus Transport Pass</span>
            </div>
          </div>
          <span className={`pass-status ${passData.isActive ? "active" : "inactive"}`}>
            {passData.isActive ? "ACTIVE" : "EXPIRED"}
          </span>
        </div>

        {/* Card Body */}
        <div className="pass-card-body">
          <div className="pass-photo-area">
            <div className="pass-photo">
              <span>🎒</span>
            </div>
            <span className="pass-name">{passData.studentName}</span>
            <span className="pass-adm">{passData.admNumber}</span>
          </div>

          <div className="pass-details-grid">
            <div className="pass-detail">
              <span className="pass-detail-label">Department</span>
              <span className="pass-detail-value">{passData.department}</span>
            </div>
            <div className="pass-detail">
              <span className="pass-detail-label">Semester</span>
              <span className="pass-detail-value">{passData.semester}</span>
            </div>
            <div className="pass-detail">
              <span className="pass-detail-label">Bus Number</span>
              <span className="pass-detail-value">{passData.busNumber}</span>
            </div>
            <div className="pass-detail">
              <span className="pass-detail-label">Route</span>
              <span className="pass-detail-value">{passData.routeName}</span>
            </div>
            <div className="pass-detail">
              <span className="pass-detail-label">Boarding Stop</span>
              <span className="pass-detail-value">{passData.stopName}</span>
            </div>
            <div className="pass-detail">
              <span className="pass-detail-label">Valid Until</span>
              <span className="pass-detail-value">{passData.validUntil}</span>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="pass-card-footer">
          <span>Pass ID: THKBS-{passData.admNumber}-{passData.busId}</span>
          <span>Issued by ThinkBus Admin</span>
        </div>
      </div>
    </div>
  );
}

export default MyBusPass;
