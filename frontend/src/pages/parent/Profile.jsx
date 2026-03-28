// frontend/src/pages/parent/Profile.jsx
// ----------------------------------------
// Displays the parent's profile details:
// name, phone, address, and username.
// ----------------------------------------

import { useState, useEffect } from "react";
import { fetchParentProfile } from "../../api";
import "./ParentPages.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username = JSON.parse(localStorage.getItem("thinkbus_user"))?.username || "";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchParentProfile(username);
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
      <div className="parent-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile…</p>
      </div>
    );
  }
  if (error) return <div className="parent-error">{error}</div>;

  return (
    <div className="parent-page" id="parent-profile">
      <div className="parent-page-header">
        <h2>My Profile</h2>
        <p className="parent-page-subtitle">Your account details</p>
      </div>

      <div className="profile-card">
        {/* Avatar */}
        <div className="profile-avatar">
          <span className="profile-avatar-icon">👤</span>
          <h3 className="profile-name">{profile.full_name}</h3>
          <span className="profile-role-badge">Parent</span>
        </div>

        {/* Details */}
        <div className="profile-details">
          <div className="profile-row">
            <span className="profile-label">👤 Full Name</span>
            <span className="profile-value">{profile.full_name}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">📧 Username</span>
            <span className="profile-value">{profile.username}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">📞 Phone Number</span>
            <span className="profile-value">{profile.phone_number || "Not provided"}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">🏠 Address</span>
            <span className="profile-value">{profile.address || "Not provided"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
