// frontend/src/pages/admin/RouteTraffic.jsx
// -------------------------------------------
// Routes & Traffic Management
// Displays ongoing routes, their stops, and full CRUD via modal.
// -------------------------------------------

import { useState, useEffect } from "react";
import {
  fetchAdminRoutesDetailed,
  createAdminRoute,
  updateAdminRoute,
  deleteAdminRoute
} from "../../api";
import "./RouteTraffic.css";
// We reuse some modal/toast CSS classes from FleetManager.css, so we import it strictly for those generic components if they aren't globally defined.
// Actually, I'll just rely on FleetManager's global classes for Toast/Modal since they are simple.
import "./FleetManager.css";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fm-toast ${type}`}>
      {type === "success" ? "✅ " : "❌ "}
      <span>{message}</span>
    </div>
  );
}

function RouteTraffic() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRouteId, setExpandedRouteId] = useState(null);
  const [toast, setToast] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    start_point: "",
    end_point: "",
    estimated_duration_minutes: 60,
    stops: []
  });
  const [saving, setSaving] = useState(false);

  // Confirm Delete
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadRoutes();
  }, []);

  async function loadRoutes() {
    setLoading(true);
    try {
      const res = await fetchAdminRoutesDetailed();
      if (res.success) setRoutes(res.data || []);
      else showToast(res.message, "error");
    } catch (err) {
      console.error("Failed to load routes", err);
      showToast("Error connecting to database", "error");
    }
    setLoading(false);
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  function toggleExpand(id) {
    setExpandedRouteId(prev => (prev === id ? null : id));
  }

  // ─── Modal & Form Handlers ───
  function handleOpenAdd() {
    setModalMode("add");
    setFormData({
      id: null,
      name: "",
      start_point: "",
      end_point: "",
      estimated_duration_minutes: 60,
      stops: [
        { stop_name: "", time_from_start_mins: 0 }
      ]
    });
    setModalOpen(true);
  }

  function handleOpenEdit(r, e) {
    e.stopPropagation(); // prevent accordion toggle
    setModalMode("edit");
    
    // Convert route_stops into form state 'stops'
    const routeStops = r.route_stops ? r.route_stops.map(st => ({
      stop_name: st.stop_name,
      time_from_start_mins: st.time_from_start_mins
    })) : [];

    setFormData({
      id: r.id,
      name: r.name,
      start_point: r.start_point,
      end_point: r.end_point,
      estimated_duration_minutes: r.estimated_duration_minutes,
      stops: routeStops
    });
    setModalOpen(true);
  }

  function handleAddStopField() {
    const lastStop = formData.stops[formData.stops.length - 1];
    const newTime = lastStop ? parseInt(lastStop.time_from_start_mins, 10) + 10 : 0;
    
    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, { stop_name: "", time_from_start_mins: newTime }]
    }));
  }

  function handleRemoveStopField(index) {
    const newStops = [...formData.stops];
    newStops.splice(index, 1);
    setFormData(prev => ({ ...prev, stops: newStops }));
  }

  function handleStopChange(index, field, value) {
    const newStops = [...formData.stops];
    // if field is time_from_start_mins, parse as int, otherwise string
    newStops[index][field] = field === 'time_from_start_mins' ? (value ? parseInt(value, 10) : 0) : value;
    setFormData(prev => ({ ...prev, stops: newStops }));
  }

  async function handleSaveRoute(e) {
    e.preventDefault();
    if (!formData.name || !formData.start_point || !formData.end_point) {
      showToast("Please fill all required route fields", "error");
      return;
    }
    
    // Prevent empty stop names
    for (let s of formData.stops) {
      if (!s.stop_name.trim()) {
        showToast("Stop names cannot be empty", "error");
        return;
      }
    }

    setSaving(true);
    try {
      if (modalMode === "add") {
        const res = await createAdminRoute(formData);
        if (res.success) {
          showToast("Route created successfully");
          loadRoutes();
          setModalOpen(false);
        } else {
          showToast(res.message || "Failed to create", "error");
        }
      } else {
        const res = await updateAdminRoute(formData.id, formData);
        if (res.success) {
          showToast("Route updated completely");
          loadRoutes();
          setModalOpen(false);
        } else {
          showToast(res.message || "Failed to edit", "error");
        }
      }
    } catch (err) {
      console.error("Save error", err);
      showToast("Unexpected error occurred", "error");
    }
    setSaving(false);
  }

  // ─── Delete Handlers ───
  function handleRequestDelete(r, e) {
    e.stopPropagation();
    setRouteToDelete(r);
    setConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    try {
      const res = await deleteAdminRoute(routeToDelete.id);
      if (res.success) {
        showToast("Route and all its stops deleted");
        loadRoutes();
        setConfirmOpen(false);
      } else {
        showToast(res.message || "Failed to delete", "error");
      }
    } catch (err) {
      console.error("Delete error", err);
      showToast("Error deleting route", "error");
    }
    setDeleting(false);
  }

  return (
    <div className="route-traffic-page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Map Widget Header Placeholder */}
      <div className="rt-map-widget">
        <div className="rt-map-bg"></div>
        <div className="rt-map-content">
          <div className="rt-map-icon">🗺️</div>
          <h3>Live Map View</h3>
          <p>Interactive GPS route tracking and traffic simulation will be enabled here in a future update.</p>
        </div>
      </div>

      {/* Section Header */}
      <div className="rt-section-header">
        <div className="rt-section-title">
          <div className="rt-section-icon">🛣️</div>
          <div>
            <h2>Active Routes & Traffic</h2>
            <span className="rt-badge">{routes.length} Active Routes</span>
          </div>
        </div>
        <button className="fm-add-btn" onClick={handleOpenAdd}>
          <span>+</span> Add Route
        </button>
      </div>

      {/* Routes List */}
      {loading ? (
        <div className="rt-loader">Loading routes from database...</div>
      ) : routes.length === 0 ? (
        <div className="rt-empty">
          <span className="fm-empty-icon">📍</span>
          <h3>No Routes Configured</h3>
          <p>Create your first route to start organizing the bus network.</p>
        </div>
      ) : (
        <div className="rt-list">
          {routes.map(r => (
            <div className={`rt-card ${expandedRouteId === r.id ? 'expanded' : ''}`} key={r.id}>
              
              {/* Card Header (Accordion Toggle) */}
              <div className="rt-card-header" onClick={() => toggleExpand(r.id)}>
                <div className="rt-card-info">
                  <span className="rt-card-icon">📍</span>
                  <div>
                    <h3 className="rt-route-name">{r.name}</h3>
                    <p className="rt-route-meta">
                      {r.start_point} ➔ {r.end_point}
                      <span className="rt-meta-dot">●</span>
                      {r.estimated_duration_minutes} mins
                      <span className="rt-meta-dot">●</span>
                      {r.route_stops?.length || 0} stops
                    </p>
                  </div>
                </div>

                <div className="rt-card-controls">
                  <button className="rt-action-btn fm-btn-edit" onClick={(e) => handleOpenEdit(r, e)}>Edit</button>
                  <button className="rt-action-btn rt-action-delete" onClick={(e) => handleRequestDelete(r, e)}>Delete</button>
                  <span className="rt-expand-icon">▼</span>
                </div>
              </div>

              {/* Card Body (Stops Timeline) */}
              {expandedRouteId === r.id && (
                <div className="rt-stops-body">
                  {r.route_stops && r.route_stops.length > 0 ? (
                    <div className="rt-timeline">
                      {r.route_stops.map((stop, idx) => (
                        <div className="rt-stop-item" key={stop.id || idx}>
                          <div className="rt-stop-marker"></div>
                          <div className="rt-stop-details">
                            <h4>{stop.stop_name}</h4>
                            <p>{stop.time_from_start_mins === 0 ? "Start Point (0 mins)" : `+${stop.time_from_start_mins} mins from start`}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ marginTop: 20, color: '#94a3b8' }}>No stops configured for this route.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div className="fm-modal-overlay" style={{ alignItems: "flex-start", paddingTop: "5vh" }}>
          <div className="fm-modal" style={{ maxWidth: 600 }}>
            <div className="fm-modal-header">
              <h3>{modalMode === "add" ? "Create New Route" : "Edit Route"}</h3>
              <button className="fm-close-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            
            <form onSubmit={handleSaveRoute}>
              <div className="fm-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                
                {/* Basic Route Details */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="fm-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Route Name *</label>
                    <input 
                      type="text" required 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Route 3 (Kottarakkara)"
                    />
                  </div>
                  
                  <div className="fm-form-group">
                    <label>Start Point *</label>
                    <input 
                      type="text" required 
                      value={formData.start_point}
                      onChange={e => setFormData({...formData, start_point: e.target.value})}
                      placeholder="e.g. Kottarakkara"
                    />
                  </div>
                  
                  <div className="fm-form-group">
                    <label>Terminal Point *</label>
                    <input 
                      type="text" required 
                      value={formData.end_point}
                      onChange={e => setFormData({...formData, end_point: e.target.value})}
                      placeholder="e.g. College"
                    />
                  </div>

                  <div className="fm-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Estimated Total Duration (Mins) *</label>
                    <input 
                      type="number" required min="5"
                      value={formData.estimated_duration_minutes}
                      onChange={e => setFormData({...formData, estimated_duration_minutes: parseInt(e.target.value, 10) || 0})}
                    />
                  </div>
                </div>

                {/* Sub-Stops Builder */}
                <div className="rt-stop-builder">
                  <h4>
                    <span>📍 Sequence of Stops</span>
                    <button type="button" className="rt-add-stop-btn" onClick={handleAddStopField}>+ Add Stop</button>
                  </h4>
                  
                  {formData.stops.map((stop, i) => (
                    <div className="rt-stop-row" key={i}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', width: 20 }}>{i+1}.</span>
                      <input 
                        type="text" 
                        required 
                        placeholder="Stop Name" 
                        value={stop.stop_name}
                        onChange={e => handleStopChange(i, 'stop_name', e.target.value)}
                      />
                      <input 
                        type="number" 
                        required 
                        className="rt-stop-time"
                        min="0"
                        title="Minutes from start"
                        value={stop.time_from_start_mins}
                        onChange={e => handleStopChange(i, 'time_from_start_mins', e.target.value)}
                      />
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>min</span>
                      <button 
                        type="button" 
                        className="rt-remove-stop" 
                        onClick={() => handleRemoveStopField(i)}
                        title="Remove Stop"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {formData.stops.length === 0 && (
                    <p style={{fontSize: '0.85rem', color: '#94a3b8'}}>No stops added yet. Click "+ Add Stop" to start mapping the route.</p>
                  )}
                </div>

              </div>

              <div className="fm-modal-footer">
                <button type="button" className="fm-btn fm-btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="fm-btn fm-btn-primary" disabled={saving}>
                  {saving ? "Deploying Route..." : "Save Route Design"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {confirmOpen && routeToDelete && (
        <div className="fm-modal-overlay">
          <div className="fm-modal confirm">
            <div className="fm-modal-body">
              <div className="fm-confirm-icon">⚠️</div>
              <h3>Confirm Deletion</h3>
              <p className="fm-confirm-text">
                Are you sure you want to delete the route <strong>{routeToDelete.name}</strong>? 
                This will automatically remove all associated stops ({routeToDelete.route_stops?.length || 0}) permanently.
              </p>
              
              <div className="fm-form-group" style={{ display: 'flex', gap: '10px' }}>
                <button className="fm-btn fm-btn-cancel" style={{flex: 1}} onClick={() => setConfirmOpen(false)}>
                  Cancel
                </button>
                <button className="fm-btn fm-btn-danger" style={{flex: 1}} onClick={handleConfirmDelete} disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete Route"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default RouteTraffic;
