import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(
    sessionStorage.getItem("user") || localStorage.getItem("user")
  );
  const role = (user?.role || "").toLowerCase();

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h3>
        {role === "superadmin" && "SuperAdmin Panel"}
        {role === "admin" && "Admin Panel"}
        {role === "staff" && "Staff Panel"}
      </h3>

      {/* SUPERADMIN MENU */}
      {role === "superadmin" && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/manage-users">Manage Users</Link>
          <Link to="/topics">Awareness Topics</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/policies">Policies</Link>
        </>
      )}

      {/* ADMIN MENU */}
      {role === "admin" && (
        <>
          <Link to="/admin-dashboard">Dashboard</Link>
          <Link to="/manage-staff">Manage Staff</Link>
          <Link to="/topics">Awareness Topics</Link>
          <Link to="/add-quiz">Add Quiz</Link>
          <Link to="/reports">Awareness Report</Link>
          <Link to="/manage-tips">Manage Tips</Link>
        </>
      )}

      {/* STAFF MENU */}
      {role === "staff" && (
        <>
          <Link to="/staff-dashboard">Dashboard</Link>
          <Link to="/awareness-topics">Awareness Topics</Link>
          <Link to="/my-reports">My Results</Link>
        </>
      )}

      <button onClick={handleLogout} className="logout-btn">
        🚪 Logout
      </button>
    </div>
  );
};

export default Sidebar;
