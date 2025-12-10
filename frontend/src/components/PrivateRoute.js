// src/components/PrivateRoute.js
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  // Read from sessionStorage first (tab-specific)
  const storedUser =
    sessionStorage.getItem("user") || localStorage.getItem("user");

  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");

  // Not logged in
  if (!storedUser || !token) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(storedUser);
  const normalizedRole = (user.role || "").toLowerCase();
  const allowed = allowedRoles.map((r) => r.toLowerCase());

  // Role not allowed → redirect based on THEIR role
  if (!allowed.includes(normalizedRole)) {
    let redirectPath = "/";

    if (normalizedRole === "superadmin") redirectPath = "/dashboard";
    else if (normalizedRole === "admin") redirectPath = "/admin-dashboard";
    else if (normalizedRole === "staff") redirectPath = "/staff-dashboard";

    return <Navigate to={redirectPath} replace />;
  }

  // Everything OK → allow access
  return children;
};

export default PrivateRoute;
