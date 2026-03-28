// frontend/src/pages/parent/Fees.jsx
// ----------------------------------------
// Shows transport fee details for each child:
// total, paid, pending, and status.
// ----------------------------------------

import { useState, useEffect } from "react";
import { fetchParentFees } from "../../api";
import "./ParentPages.css";

function Fees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username = JSON.parse(localStorage.getItem("thinkbus_user"))?.username || "";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchParentFees(username);
        if (res.success) {
          setFees(res.fees);
        } else {
          setError(res.message || "Failed to load fee details");
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
        <p>Loading fee details…</p>
      </div>
    );
  }
  if (error) return <div className="parent-error">{error}</div>;

  // Calculate totals across all children
  const totalFee = fees.reduce((sum, f) => sum + f.total_fee, 0);
  const totalPaid = fees.reduce((sum, f) => sum + f.paid_amount, 0);
  const totalPending = fees.reduce((sum, f) => sum + f.pending_amount, 0);

  return (
    <div className="parent-page" id="parent-fees">
      <div className="parent-page-header">
        <h2>Transport Fees</h2>
        <p className="parent-page-subtitle">Fee summary for the current academic year</p>
      </div>

      {/* Overall summary */}
      <div className="summary-cards">
        <div className="summary-card">
          <span className="summary-icon" style={{ background: "#dbeafe", color: "#2563eb" }}>💰</span>
          <div className="summary-body">
            <span className="summary-value">₹{totalFee.toLocaleString()}</span>
            <span className="summary-label">Total Fee</span>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>✅</span>
          <div className="summary-body">
            <span className="summary-value">₹{totalPaid.toLocaleString()}</span>
            <span className="summary-label">Paid</span>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon" style={{ background: "#fef3c7", color: "#d97706" }}>⏳</span>
          <div className="summary-body">
            <span className="summary-value">₹{totalPending.toLocaleString()}</span>
            <span className="summary-label">Pending</span>
          </div>
        </div>
      </div>

      {/* Per-child fee table */}
      <h3 className="section-title">Fee Breakdown by Child</h3>
      <div className="fees-table-wrapper">
        <table className="fees-table">
          <thead>
            <tr>
              <th>Child Name</th>
              <th>Semester</th>
              <th>Total Fee</th>
              <th>Paid</th>
              <th>Pending</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee, idx) => (
              <tr key={idx}>
                <td className="td-name">{fee.child_name}</td>
                <td>{fee.semester}</td>
                <td>₹{fee.total_fee.toLocaleString()}</td>
                <td className="text-green">₹{fee.paid_amount.toLocaleString()}</td>
                <td className="text-orange">₹{fee.pending_amount.toLocaleString()}</td>
                <td>
                  <span
                    className={`status-badge ${
                      fee.status === "Paid" ? "badge--green" : fee.status === "Partially Paid" ? "badge--yellow" : "badge--red"
                    }`}
                  >
                    {fee.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Fees;
