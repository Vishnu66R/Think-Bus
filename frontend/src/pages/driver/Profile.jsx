// frontend/src/pages/driver/Profile.jsx
// ----------------------------------------
// Displays the driver's profile details:
// name, phone, license, bus number.
// ----------------------------------------

import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Bus 
} from "lucide-react";
import { fetchDriverProfile } from "../../api";
import "./DriverPages.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username = JSON.parse(localStorage.getItem("thinkbus_user"))?.username || "";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchDriverProfile(username);
        if (res.success) {
          setProfile(res.profile);
        } else {
          setError(res.message || "Failed to load profile");
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
      <div className="driver-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile…</p>
      </div>
    );
  }
  if (error) return <div className="driver-error">{error}</div>;

  return (
    <div className="driver-page" id="driver-profile">
      <div className="driver-page-header">
        <h2>My Profile</h2>
        <p className="driver-page-subtitle">Your account details</p>
      </div>

      <div className="profile-card">
        {/* Avatar */}
        <div className="profile-avatar" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
          <span className="profile-avatar-icon">
            <User size={40} />
          </span>
          <h3 className="profile-name">{profile.full_name}</h3>
          <span className="profile-role-badge">Driver</span>
        </div>

        {/* Details */}
        <div className="profile-details">
          <div className="profile-row">
            <span className="profile-label">
              <User size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Full Name
            </span>
            <span className="profile-value">{profile.full_name}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">
               <Mail size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
               Username
            </span>
            <span className="profile-value">{profile.username}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">
              <Phone size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Phone Number
            </span>
            <span className="profile-value">{profile.phone_number || "Not provided"}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">
              <CreditCard size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              License Number
            </span>
            <span className="profile-value">{profile.license_number || "Not provided"}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">
              <Bus size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Assigned Bus
            </span>
            <span className="profile-value">{profile.bus_number}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
