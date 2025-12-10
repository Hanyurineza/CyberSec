import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand fw-bold" to="/">
        Cybersecurity Awareness
      </Link>

      <div className="collapse navbar-collapse show">
        <ul className="navbar-nav ms-auto">
          {/* SUPERADMIN */}
          {role === "superadmin" && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/manage-users">
                  Manage Users
                </Link>
              </li>
            </>
          )}

          {/* ADMIN */}
          {role === "admin" && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/admin-dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/manage-staff">
                  Manage Staff
                </Link>
              </li>
            </>
          )}

          {/* STAFF */}
          {role === "staff" && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/staff-dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/awareness-topics">
                  Awareness Topics
                </Link>
              </li>
            </>
          )}

          <li className="nav-item">
            <button
              className="btn btn-outline-light ms-3"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
