// frontend/src/api.js
// ------------------------------------------------------------
// Centralizes all API calls to the FastAPI backend.
// Change BASE_URL here if your backend runs on a different port.
// ------------------------------------------------------------

const BASE_URL = "http://localhost:8000";

// POST /signup
export async function signupUser(username, password, role) {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role }),
  });
  const data = await response.json();
  return data; // { success, message }
}

// POST /login
export async function loginUser(username, password, role) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role }),
  });
  const data = await response.json();
  return data; // { success, message, role, username }
}

// ─── Parent Panel API ───

// GET /parent/dashboard
export async function fetchParentDashboard(username) {
  const response = await fetch(`${BASE_URL}/parent/dashboard?username=${encodeURIComponent(username)}`);
  return response.json();
}

// GET /parent/children
export async function fetchParentChildren(username) {
  const response = await fetch(`${BASE_URL}/parent/children?username=${encodeURIComponent(username)}`);
  return response.json();
}

// GET /parent/bus-info
export async function fetchParentBusInfo(username) {
  const response = await fetch(`${BASE_URL}/parent/bus-info?username=${encodeURIComponent(username)}`);
  return response.json();
}

// GET /parent/alerts
export async function fetchParentAlerts(username) {
  const response = await fetch(`${BASE_URL}/parent/alerts?username=${encodeURIComponent(username)}`);
  return response.json();
}

// GET /parent/fees
export async function fetchParentFees(username) {
  const response = await fetch(`${BASE_URL}/parent/fees?username=${encodeURIComponent(username)}`);
  return response.json();
}

// GET /parent/profile
export async function fetchParentProfile(username) {
  const response = await fetch(`${BASE_URL}/parent/profile?username=${encodeURIComponent(username)}`);
  return response.json();
}

// ─── Driver Panel API ───

// GET /driver/profile
export async function fetchDriverProfile(username) {
  const response = await fetch(`${BASE_URL}/driver/profile?username=${encodeURIComponent(username)}`);
  return response.json();
}

// GET /driver/my-route
export async function fetchDriverRoute(username) {
  const response = await fetch(`${BASE_URL}/driver/my-route?username=${encodeURIComponent(username)}`);
  return response.json();
}

// GET /driver/navigate
export async function fetchDriverNavigation(username) {
  const response = await fetch(`${BASE_URL}/driver/navigate?username=${encodeURIComponent(username)}`);
  return response.json();
}

// GET /driver/summary
export async function fetchDriverSummary(username) {
  const response = await fetch(`${BASE_URL}/driver/summary?username=${encodeURIComponent(username)}`);
  return response.json();
}

// GET /driver/status
export async function fetchDriverStatus(username) {
  const response = await fetch(`${BASE_URL}/driver/status?username=${encodeURIComponent(username)}`);
  return response.json();
}

// POST /driver/emergency
export async function reportEmergency(username, type, message) {
  const response = await fetch(`${BASE_URL}/driver/emergency?username=${encodeURIComponent(username)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, message }),
  });
  return response.json();
}

// POST /driver/status
export async function updateDriverStatus(username, status) {
  const response = await fetch(`${BASE_URL}/driver/status?username=${encodeURIComponent(username)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return response.json();
}
