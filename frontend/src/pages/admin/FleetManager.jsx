// frontend/src/pages/admin/FleetManager.jsx
// -------------------------------------------
// Fleet Manager page - manages bus fleet with CRUD.
// -------------------------------------------

import { useState, useEffect } from "react";
import { 
  Bus, 
  Users, 
  Route, 
  User, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  X,
  Plus
} from "lucide-react";
import {
  fetchAdminBuses,
  createAdminBus,
  updateAdminBus,
  deleteAdminBus,
  fetchAdminRoutes,
  fetchAdminDrivers
} from "../../api";
import "./FleetManager.css";

// ─── Toast Component ───
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fm-toast ${type}`}>
      {type === "success" ? <CheckCircle size={18} style={{ marginRight: '8px' }} /> : <XCircle size={18} style={{ marginRight: '8px' }} />}
      <span>{message}</span>
    </div>
  );
}

function FleetManager() {
  // ─── Main State ───
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // ─── Modal State ───
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [formData, setFormData] = useState({
    id: null,
    registration_number: "",
    capacity: 40,
    driver_id: "",
    route_id: "",
    status: "Idle"
  });
  const [saving, setSaving] = useState(false);

  // ─── Confirm Delete State ───
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busToDelete, setBusToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ─── Initial Load ───
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [bRes, rRes, dRes] = await Promise.all([
        fetchAdminBuses(),
        fetchAdminRoutes(),
        fetchAdminDrivers()
      ]);

      if (bRes.success) setBuses(bRes.data || []);
      if (rRes.success) setRoutes(rRes.data || []);
      if (dRes.success) setDrivers(dRes.data || []);
    } catch (err) {
      console.error("Failed to load fleet data", err);
      showToast("Failed to connect to database.", "error");
    }
    setLoading(false);
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  // ─── Form Handlers ───
  function handleOpenAdd() {
    setModalMode("add");
    setFormData({
      id: null,
      registration_number: "",
      capacity: 40,
      driver_id: "",
      route_id: "",
      status: "Idle"
    });
    setModalOpen(true);
  }

  function handleOpenEdit(bus) {
    setModalMode("edit");
    setFormData({
      id: bus.id,
      registration_number: bus.registration_number,
      capacity: bus.capacity,
      driver_id: bus.driver_id || "",
      route_id: bus.route_id || "",
      status: bus.status || "Idle"
    });
    setModalOpen(true);
  }

  async function handleSaveBus(e) {
    e.preventDefault();
    if (!formData.registration_number || !formData.capacity) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        registration_number: formData.registration_number,
        capacity: parseInt(formData.capacity, 10),
        driver_id: formData.driver_id ? parseInt(formData.driver_id, 10) : null,
        route_id: formData.route_id ? parseInt(formData.route_id, 10) : null,
        status: formData.status
      };

      if (modalMode === "add") {
        const res = await createAdminBus(payload);
        if (res.success) {
          showToast("Bus added successfully");
          loadData();
          setModalOpen(false);
        } else {
          showToast(res.message || "Failed to add bus", "error");
        }
      } else {
        const res = await updateAdminBus(formData.id, payload);
        if (res.success) {
          showToast("Bus details updated");
          loadData();
          setModalOpen(false);
        } else {
          showToast(res.message || "Failed to update bus", "error");
        }
      }
    } catch (err) {
      console.error("Save error", err);
      showToast("An unexpected error occurred", "error");
    }
    setSaving(false);
  }

  // ─── Delete Handlers ───
  function handleRequestDelete(bus) {
    setBusToDelete(bus);
    setConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!busToDelete) return;
    setDeleting(true);
    try {
      const res = await deleteAdminBus(busToDelete.id);
      if (res.success) {
        showToast(`Bus ${busToDelete.registration_number} deleted globally`);
        loadData();
        setConfirmOpen(false);
      } else {
        showToast(res.message || "Failed to delete bus", "error");
      }
    } catch (err) {
      console.error("Delete error", err);
      showToast("An unexpected error occurred", "error");
    }
    setDeleting(false);
  }

  // Calculate available drivers for the dropdown
  const currentBus = modalMode === "edit" && formData.id ? buses.find(b => b.id === formData.id) : null;
  const originalDriverId = currentBus ? currentBus.driver_id : null;
  const availableDrivers = drivers.filter(d => !d.bus_registration || d.id === originalDriverId);

  // ─── Renderers ───
  return (
    <div className="fleet-manager" id="fleet-manager-page">
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="fm-header">
        <div className="fm-title">
          <div className="fm-title-icon">
            <Bus size={28} />
          </div>
          <div>
            <h2>Fleet Manager</h2>
            <span className="fm-stats-badge">{buses.length} Total Buses</span>
          </div>
        </div>
        <button className="fm-add-btn" onClick={handleOpenAdd}>
          <Plus size={18} style={{ marginRight: '8px' }} /> Add New Bus
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="fm-loader">Fetching fleet data from database...</div>
      ) : buses.length === 0 ? (
        <div className="fm-empty">
          <span className="fm-empty-icon">
            <Bus size={48} />
          </span>
          <h3>No Buses Found</h3>
          <p>Your fleet database is currently empty. Add a bus to get started.</p>
        </div>
      ) : (
        <div className="fm-grid">
          {buses.map(bus => (
            <div className="fm-card" key={bus.id}>
              {/* Card Header */}
              <div className="fm-card-header">
                <div>
                  <h3 className="fm-bus-number">
                    <span className="fm-bus-number-icon">
                      <Bus size={18} />
                    </span> {bus.registration_number}
                  </h3>
                  <span className="fm-bus-id">ID: #{bus.id}</span>
                </div>
                <div className={`fm-status status-${(bus.status || 'idle').toLowerCase()}`}>
                  {bus.status || 'Idle'}
                </div>
              </div>

              {/* Card Details */}
              <div className="fm-card-body">
                <div className="fm-detail">
                  <span className="fm-detail-icon">
                    <Users size={16} />
                  </span>
                  <span>Capacity: <span className="fm-detail-value">{bus.capacity} seats</span></span>
                </div>
                
                <div className="fm-detail">
                  <span className="fm-detail-icon">
                    <Route size={16} />
                  </span>
                  <span>Route: {bus.routes?.name ? (
                     <span className="fm-detail-value">{bus.routes.name}</span>
                  ) : (
                    <span className="fm-detail-unassigned">Unassigned</span>
                  )}</span>
                </div>

                <div className="fm-detail">
                  <span className="fm-detail-icon">
                    <User size={16} />
                  </span>
                  <span>Driver: {bus.drivers?.full_name ? (
                     <span className="fm-detail-value">{bus.drivers.full_name}</span>
                  ) : (
                    <span className="fm-detail-unassigned">Unassigned</span>
                  )}</span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="fm-card-footer">
                <button className="fm-action-btn fm-btn-edit" onClick={() => handleOpenEdit(bus)}>
                  <Edit2 size={14} style={{ marginRight: '4px' }} /> Edit
                </button>
                <button className="fm-action-btn fm-btn-delete" onClick={() => handleRequestDelete(bus)}>
                  <Trash2 size={14} style={{ marginRight: '4px' }} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div className="fm-modal-overlay">
          <div className="fm-modal">
            <div className="fm-modal-header">
              <h3>{modalMode === "add" ? "Add New Bus" : "Edit Bus Details"}</h3>
              <button className="fm-close-btn" onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveBus}>
              <div className="fm-modal-body">
                <div className="fm-form-group">
                  <label>Registration Number *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. KL-02-AB-1234"
                    value={formData.registration_number}
                    onChange={e => setFormData({...formData, registration_number: e.target.value})}
                  />
                </div>
                
                <div className="fm-form-group">
                  <label>Capacity (Seats) *</label>
                  <input 
                    type="number" 
                    required 
                    min="10" max="100"
                    value={formData.capacity}
                    onChange={e => setFormData({...formData, capacity: e.target.value})}
                  />
                </div>

                <div className="fm-form-group">
                  <label>Assign Driver</label>
                  <select 
                    value={formData.driver_id} 
                    onChange={e => setFormData({...formData, driver_id: e.target.value})}
                  >
                    <option value="">-- No Driver Assigned --</option>
                    {availableDrivers.map(d => (
                      <option key={d.id} value={d.id}>{d.full_name}</option>
                    ))}
                    {availableDrivers.length === 0 && (
                      <option value="" disabled>No free drivers available</option>
                    )}
                  </select>
                </div>

                <div className="fm-form-group">
                  <label>Assign Route</label>
                  <select 
                    value={formData.route_id} 
                    onChange={e => setFormData({...formData, route_id: e.target.value})}
                  >
                    <option value="">-- No Route Assigned --</option>
                    {routes.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="fm-form-group">
                  <label>Current Status</label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Idle">Idle</option>
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Breakdown">Breakdown</option>
                  </select>
                </div>
              </div>

              <div className="fm-modal-footer">
                <button type="button" className="fm-btn fm-btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="fm-btn fm-btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Bus"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Confirm Delete Dialog ── */}
      {confirmOpen && busToDelete && (
        <div className="fm-modal-overlay">
          <div className="fm-modal confirm">
            <div className="fm-modal-body">
              <div className="fm-confirm-icon" style={{ color: '#ef4444' }}>
                <AlertTriangle size={48} />
              </div>
              <h3>Confirm Deletion</h3>
              <p className="fm-confirm-text">
                Are you sure you want to delete bus <strong>{busToDelete.registration_number}</strong>? 
                This action is permanent and will remove it from the database globally.
              </p>
              
              <div className="fm-form-group" style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="fm-btn fm-btn-cancel" 
                  style={{flex: 1}} 
                  onClick={() => setConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  className="fm-btn fm-btn-danger" 
                  style={{flex: 1}} 
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Yes, Delete Bus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default FleetManager;
