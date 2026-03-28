// frontend/src/App.jsx
// -----------------------------------
// Root application component.
// Sets up routing for auth pages, admin panel, and student panel.
// Auth flow is preserved — DO NOT modify login/signup logic.
// -----------------------------------

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Auth Pages (existing — untouched)
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import WelcomePage from "./pages/WelcomePage";

// Admin Layout & Pages
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import FleetManager from "./pages/admin/FleetManager";
import RouteTraffic from "./pages/admin/RouteTraffic";
import PeopleRegistry from "./pages/admin/PeopleRegistry";
import Sustainability from "./pages/admin/Sustainability";
import SystemConfig from "./pages/admin/SystemConfig";

// Student Layout & Pages
import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/Dashboard";
import MyBusPass from "./pages/student/MyBusPass";
import Planner from "./pages/student/Planner";
import Notifications from "./pages/student/Notifications";
import Profile from "./pages/student/Profile";

// Parent Layout & Pages
import ParentLayout from "./layouts/ParentLayout";
import ParentDashboard from "./pages/parent/Dashboard";
import ParentBusInfo from "./pages/parent/BusInfo";
import ParentAlerts from "./pages/parent/Alerts";
import ParentFees from "./pages/parent/Fees";
import ParentChildren from "./pages/parent/Children";
import ParentProfile from "./pages/parent/Profile";

// Driver Layout & Pages
import DriverLayout from "./layouts/DriverLayout";
import DriverMyRoute from "./pages/driver/MyRoute";
import DriverNavigate from "./pages/driver/Navigate";
import DriverEmergency from "./pages/driver/Emergency";
import DriverSummary from "./pages/driver/Summary";
import DriverStatus from "./pages/driver/Status";
import DriverProfile from "./pages/driver/Profile";

function AppRoutes() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  // Called by LoginPage on successful login
  function handleLoginSuccess(username, role) {
    setLoggedInUser({ username, role });
    // Persist to localStorage so panel pages can read the username
    localStorage.setItem("thinkbus_user", JSON.stringify({ username, role }));

    // Redirect based on role
    if (role === "Admin") {
      navigate("/admin/dashboard");
    } else if (role === "Student") {
      navigate("/student/dashboard");
    } else if (role === "Parent") {
      navigate("/parent/dashboard");
    } else if (role === "Driver") {
      navigate("/driver/route");
    } else {
      navigate("/welcome");
    }
  }

  // Called by Sidebar logout or other logout triggers
  function handleLogout() {
    setLoggedInUser(null);
    localStorage.removeItem("thinkbus_user");
    sessionStorage.clear();
    navigate("/login");
  }

  return (
    <Routes>
      {/* Default → Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth Routes (existing — untouched) */}
      <Route
        path="/login"
        element={
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            goToSignup={() => navigate("/signup")}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <SignupPage
            goToLogin={() => navigate("/login")}
          />
        }
      />
      <Route
        path="/welcome"
        element={
          <WelcomePage
            username={loggedInUser?.username || "Guest"}
            role={loggedInUser?.role || "User"}
            onLogout={handleLogout}
          />
        }
      />

      {/* ─── Admin Panel Routes ─── */}
      <Route
        path="/admin"
        element={
          <AdminLayout
            onLogout={handleLogout}
            username={loggedInUser?.username || "Admin"}
          />
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard"      element={<AdminDashboard />} />
        <Route path="fleet"          element={<FleetManager />} />
        <Route path="routes"         element={<RouteTraffic />} />
        <Route path="people"         element={<PeopleRegistry />} />
        <Route path="sustainability" element={<Sustainability />} />
        <Route path="system"         element={<SystemConfig />} />
      </Route>

      {/* ─── Student Panel Routes ─── */}
      <Route
        path="/student"
        element={
          <StudentLayout
            onLogout={handleLogout}
            username={loggedInUser?.username || "Student"}
          />
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard"     element={<StudentDashboard />} />
        <Route path="pass"          element={<MyBusPass />} />
        <Route path="planner"       element={<Planner />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile"       element={<Profile />} />
      </Route>

      {/* ─── Parent Panel Routes ─── */}
      <Route
        path="/parent"
        element={
          <ParentLayout
            onLogout={handleLogout}
            username={loggedInUser?.username || "Parent"}
          />
        }
      >
        <Route index element={<Navigate to="/parent/dashboard" replace />} />
        <Route path="dashboard" element={<ParentDashboard />} />
        <Route path="bus"       element={<ParentBusInfo />} />
        <Route path="alerts"    element={<ParentAlerts />} />
        <Route path="fees"      element={<ParentFees />} />
        <Route path="children"  element={<ParentChildren />} />
        <Route path="profile"   element={<ParentProfile />} />
      </Route>

      {/* ─── Driver Panel Routes ─── */}
      <Route
        path="/driver"
        element={
          <DriverLayout
            onLogout={handleLogout}
            username={loggedInUser?.username || "Driver"}
          />
        }
      >
        <Route index element={<Navigate to="/driver/route" replace />} />
        <Route path="route"     element={<DriverMyRoute />} />
        <Route path="navigate"  element={<DriverNavigate />} />
        <Route path="emergency" element={<DriverEmergency />} />
        <Route path="summary"   element={<DriverSummary />} />
        <Route path="status"    element={<DriverStatus />} />
        <Route path="profile"   element={<DriverProfile />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
