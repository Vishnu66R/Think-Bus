// frontend/src/pages/student/Notifications.jsx
// -----------------------------------------------
// Notifications page — list of transport alerts/updates.
// Shows timestamp, type badge, and message text.
// -----------------------------------------------

import { useState, useEffect } from "react";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock notifications — replace with API call
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          type: "alert",
          title: "Bus Rerouted — Route 3 (Mevarom)",
          message: "Bus KL-02-B-2003 has been rerouted due to road construction near Kundara. New route via Vellimon will add ~10 min.",
          timestamp: "2 hours ago",
          read: false,
        },
        {
          id: 2,
          type: "info",
          title: "Schedule Update — Morning Pickup",
          message: "Tomorrow's pickup from Kuttivattom has been moved to 7:35 AM due to a college event.",
          timestamp: "5 hours ago",
          read: false,
        },
        {
          id: 3,
          type: "success",
          title: "Bus Pass Renewed",
          message: "Your bus pass for Semester S4 has been successfully renewed. Valid until June 2026.",
          timestamp: "1 day ago",
          read: true,
        },
        {
          id: 4,
          type: "info",
          title: "Maintenance Notice",
          message: "Bus KL-02-B-2006 will be under maintenance on Friday. Route 6 students will be accommodated on Bus KL-02-B-2002.",
          timestamp: "2 days ago",
          read: true,
        },
        {
          id: 5,
          type: "alert",
          title: "Heavy Rain Warning",
          message: "Due to heavy rainfall forecast, all buses may have a 15-20 min delay tomorrow morning.",
          timestamp: "3 days ago",
          read: true,
        },
        {
          id: 6,
          type: "success",
          title: "Route Optimization Complete",
          message: "AI-powered route optimization has reduced average travel time by 8% across all routes.",
          timestamp: "5 days ago",
          read: true,
        },
      ]);
      setLoading(false);
    }, 400);
  }, []);

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mark a notification as read
  function markAsRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  if (loading) {
    return (
      <div className="student-loading">
        <div className="student-spinner"></div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="notifications-page" id="notifications-page">
      <div className="notif-header">
        <div>
          <h2 className="notif-title">Notifications</h2>
          <p className="notif-desc">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
              : "You're all caught up!"}
          </p>
        </div>
      </div>

      <div className="notif-list">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`notif-item ${notif.read ? "" : "unread"}`}
            onClick={() => markAsRead(notif.id)}
          >
            <div className="notif-left">
              <span className={`notif-type-badge notif-${notif.type}`}>
                {notif.type === "alert" ? "⚠️" : notif.type === "success" ? "✅" : "ℹ️"}
              </span>
            </div>
            <div className="notif-body">
              <h4 className="notif-item-title">{notif.title}</h4>
              <p className="notif-item-message">{notif.message}</p>
              <span className="notif-timestamp">{notif.timestamp}</span>
            </div>
            {!notif.read && <span className="notif-unread-dot"></span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
