// frontend/src/pages/admin/Dashboard.jsx
// ----------------------------------------
// Admin Dashboard — Command Centre
// Search bar, stats, map placeholder, ML alerts.
// ----------------------------------------

import { useEffect, useState, useRef } from "react";
import {
  fetchAdminStats,
  adminSearch,
} from "../../api";
import "./Dashboard.css";

// ─── Helper: format today's date ───
function formatDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}



function Dashboard() {
  // ─── State ───
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const searchTimeout = useRef(null);

  const adminRetryCount = useRef(0);

  // ─── Data Fetching ───
  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const statsRes = await fetchAdminStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
        adminRetryCount.current = 0;
        setLoading(false);
      } else {
        if (!stats && adminRetryCount.current < 3) {
          adminRetryCount.current++;
          setTimeout(loadDashboard, 2000);
        } else {
          setLoading(false);
        }
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
      if (!stats && adminRetryCount.current < 3) {
        adminRetryCount.current++;
        setTimeout(loadDashboard, 2000);
      } else {
        setLoading(false);
      }
    }
  }

  // ─── Search Handler ───
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setSearchOpen(false);
      return;
    }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      const res = await adminSearch(searchQuery);
      if (res.success) {
        setSearchResults(res.results);
        setSearchOpen(true);
      }
    }, 350);
    return () => clearTimeout(searchTimeout.current);
  }, [searchQuery]);

  // Close search results on outside click
  useEffect(() => {
    function handleOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Count total search results
  const totalResults = searchResults
    ? searchResults.students.length + searchResults.buses.length + searchResults.drivers.length
    : 0;

  // ─── Stat cards config ───
  const statCards = stats ? [
    { label: "Total Students",  value: stats.totalStudents,  icon: "🎓", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { label: "Active Buses",    value: stats.activeBuses,    icon: "🚌", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    { label: "Total Drivers",   value: stats.totalDrivers,   icon: "🚗", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    { label: "Optimization",    value: "94%",                icon: "⚡", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  ] : [];

  // ─── Loading ───
  if (loading) {
    return (
      <div className="dashboard-loading" id="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard" id="admin-dashboard-page">

      {/* ── Top Bar ── */}
      <div className="dash-topbar" id="dash-topbar">
        {/* Search */}
        <div className="dash-search-wrapper" ref={searchRef}>
          <span className="dash-search-icon">🔍</span>
          <input
            id="global-search"
            type="text"
            className="dash-search-input"
            placeholder="Search students, buses, drivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults && setSearchOpen(true)}
          />

          {/* ── Search Results Popup ── */}
          {searchOpen && searchResults && (
            <div className="search-results-section" id="search-results">
              <div className="search-results-header">
                <h3>Search Results</h3>
                <span className="search-results-count">{totalResults} result{totalResults !== 1 ? "s" : ""} found</span>
                <button className="search-close-btn" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>✕ Clear</button>
              </div>

              {totalResults === 0 && (
                <div className="search-no-results">
                  <span className="search-no-icon">🔍</span>
                  <p>No results found for "<strong>{searchQuery}</strong>"</p>
                  <p className="search-no-hint">Try a different name, admission number, or registration number</p>
                </div>
              )}

              {/* Student Cards */}
              {searchResults.students.length > 0 && (
                <div className="search-card-group">
                  <h4 className="search-card-group-title">🎓 Students</h4>
                  <div className="search-cards-grid">
                    {searchResults.students.map((s) => (
                      <div className="search-detail-card student-card" key={`s-${s.id}`}>
                        <div className="sdc-avatar">🎓</div>
                        <div className="sdc-info">
                          <h4 className="sdc-name">{s.full_name}</h4>
                          <div className="sdc-details">
                            <span className="sdc-tag"><strong>Adm:</strong> {s.adm_number}</span>
                            <span className="sdc-tag"><strong>Dept:</strong> {s.department}</span>
                            <span className="sdc-tag"><strong>Sem:</strong> {s.semester}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bus Cards */}
              {searchResults.buses.length > 0 && (
                <div className="search-card-group">
                  <h4 className="search-card-group-title">🚌 Buses</h4>
                  <div className="search-cards-grid">
                    {searchResults.buses.map((b) => (
                      <div className="search-detail-card bus-card" key={`b-${b.id}`}>
                        <div className="sdc-avatar">🚌</div>
                        <div className="sdc-info">
                          <h4 className="sdc-name">{b.registration_number}</h4>
                          <div className="sdc-details">
                            <span className="sdc-tag"><strong>Capacity:</strong> {b.capacity}</span>
                            <span className={`sdc-status status-badge status-${(b.status || 'idle').toLowerCase()}`}>{b.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Driver Cards */}
              {searchResults.drivers.length > 0 && (
                <div className="search-card-group">
                  <h4 className="search-card-group-title">🚗 Drivers</h4>
                  <div className="search-cards-grid">
                    {searchResults.drivers.map((d) => (
                      <div className="search-detail-card driver-card" key={`d-${d.id}`}>
                        <div className="sdc-avatar">🚗</div>
                        <div className="sdc-info">
                          <h4 className="sdc-name">{d.full_name}</h4>
                          <div className="sdc-details">
                            <span className="sdc-tag"><strong>Phone:</strong> {d.phone_number || '—'}</span>
                            <span className="sdc-tag"><strong>License:</strong> {d.license_number || '—'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Welcome */}
        <div className="dash-welcome" id="dash-welcome">
          <span className="dash-welcome-text">Welcome, Admin 👋</span>
          <span className="dash-welcome-date">{formatDate()}</span>
        </div>
      </div>

      {/* ── Command Centre ── */}
      <div className="command-centre" id="command-centre">
        <h2 className="section-title">Command Centre</h2>
        <div className="stats-grid">
          {statCards.map((card, i) => (
            <div className="stat-card" key={i} id={`stat-card-${i}`} style={{ background: card.gradient }}>
              <div className="stat-card-icon">{card.icon}</div>
              <div className="stat-card-info">
                <span className="stat-card-value">{card.value}</span>
                <span className="stat-card-label">{card.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Map + ML Alerts Row ── */}
      <div className="map-alerts-row" id="map-alerts-row">
        {/* Map Placeholder */}
        <div className="map-placeholder" id="map-placeholder">
          <div className="map-placeholder-inner">
            <div className="map-icon-big">🗺️</div>
            <h3>Live Bus Tracking</h3>
            <p>Real-time GPS map integration coming soon</p>
            <div className="map-dots">
              <span className="dot dot-1"></span>
              <span className="dot dot-2"></span>
              <span className="dot dot-3"></span>
            </div>
          </div>
        </div>

        {/* ML Alerts Placeholder */}
        <div className="ml-alerts-panel" id="ml-alerts-panel">
          <div className="ml-alerts-header">
            <h3>🤖 AI Alerts</h3>
            <span className="ml-badge">ML Engine</span>
          </div>
          <div className="ml-alerts-list">
            <div className="ml-alert-item ml-alert-warning">
              <span className="ml-pulse"></span>
              <div>
                <p className="ml-alert-title">Route 3 Congestion Predicted</p>
                <p className="ml-alert-desc">High traffic expected at 8:15 AM on Mevarom route</p>
              </div>
            </div>
            <div className="ml-alert-item ml-alert-info">
              <span className="ml-pulse pulse-blue"></span>
              <div>
                <p className="ml-alert-title">Optimization Suggestion</p>
                <p className="ml-alert-desc">Rerouting Bus 5 can save 12 mins avg travel time</p>
              </div>
            </div>
            <div className="ml-alert-item ml-alert-success">
              <span className="ml-pulse pulse-green"></span>
              <div>
                <p className="ml-alert-title">All Routes On-Time</p>
                <p className="ml-alert-desc">Morning shift completed with 98% punctuality</p>
              </div>
            </div>
          </div>
          <div className="ml-coming-soon">
            <span>Full ML pipeline coming soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
