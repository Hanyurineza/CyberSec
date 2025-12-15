// src/layout/DashboardLayout.js
import React from "react";

export default function DashboardLayout({ children }) {
  // Read logged-in user (sessionStorage first = tab-specific)
  const storedUserRaw =
    sessionStorage.getItem("user") || localStorage.getItem("user");

  const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : {};
  const role = (storedUser.role || "").toLowerCase();

  // ====== ROLE-BASED SIDEBAR LINKS ======
  let navLinks = [];

  if (role === "superadmin") {
    navLinks = [
      { href: "/dashboard", label: "📊 System Dashboard" },
      { href: "/staff", label: "👥 Manage Staff" },
      { href: "/topics", label: "📚 Awareness Topics" },
      { href: "/add-quiz", label: "🧩 Manage Quizzes" },
      { href: "/reports", label: "📈 Overall Reports" },
      { href: "/manage-tips", label: "💡 Manage Tips" },
      { href: "/policies", label: "📄 Policies" },
    ];
  } else if (role === "admin") {
    navLinks = [
      { href: "/admin-dashboard", label: "📊 Dashboard" },
      { href: "/reports", label: "📈 Our Performance" },
      { href: "/topics", label: "📚 Awareness Topics" },
      { href: "/manage-tips", label: "💡 Awareness Tips" },
      { href: "/policies", label: "📄 Policies" },
    ];
  } else {
    navLinks = [
      { href: "/staff-dashboard", label: "📊 My Dashboard" },
      { href: "/my-reports", label: "📈 My Results" },
      { href: "/tips", label: "💡 Cyber Tips" },
      { href: "/policies", label: "📄 Policies" },
    ];
  }

  const userName = storedUser.name || "User";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/dashboard-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        fontFamily: "'Poppins', sans-serif",
        color: "#0b1a3c",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* TOP BAR */}
        <header
          style={{
            backgroundColor: "#002b80",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            padding: "8px 24px",
            height: "65px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ flex: 1 }}>
            <img
              src="/images/nisr-logo.png"
              alt="NISR Logo"
              style={{
                height: "46px",
                objectFit: "contain",
              }}
            />
          </div>

          <div style={{ flex: 1, textAlign: "center" }}>
            <h1 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>
              CYBERSECURITY AWARENESS PLATFORM
            </h1>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-end",
              gap: "16px",
            }}
          >
            <span>Welcome, {userName}</span>
            <button
              onClick={() => {
                sessionStorage.clear();
                localStorage.clear();
                window.location.href = "/";
              }}
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* BODY LAYOUT */}
        <div style={{ display: "flex", flex: 1 }}>
          {/* SIDEBAR */}
          <aside
            style={{
              width: "240px",
              backgroundColor: "#003366",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              paddingTop: "20px",
            }}
          >
            <nav style={{ flex: 1 }}>
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} style={linkStyle}>
                  {link.label}
                </a>
              ))}
            </nav>

            <div
              style={{
                fontSize: "12px",
                padding: "20px",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              © 2025 NISR — Cyber Awareness
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main style={{ flex: 1, padding: "24px" }}>{children}</main>
        </div>

        <footer
          style={{
            padding: "10px 20px",
            textAlign: "center",
            fontSize: "13px",
            color: "#555",
            backgroundColor: "#fff",
            borderTop: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          © 2025 National Institute of Statistics of Rwanda — Cybersecurity
          Awareness Platform
        </footer>
      </div>
    </div>
  );
}

const linkStyle = {
  display: "block",
  padding: "12px 20px",
  color: "#fff",
  textDecoration: "none",
  borderLeft: "4px solid transparent",
  fontSize: "15px",
  fontWeight: "500",
  transition: "0.3s",
};
