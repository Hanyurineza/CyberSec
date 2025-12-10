import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = { email: form.email, password: form.password };
      const { data } = await api.post("/auth/login", payload);

      const role = (data.user?.role || "").toLowerCase();

      // 🔥 SAVE ONLY IN SESSIONSTORAGE
      sessionStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, token: data.token })
      );
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("role", role);

      // (Optional, harmless) – NOT used for authentication
      localStorage.setItem("lastLoginRole", role);

      // Redirect
      if (role === "superadmin") navigate("/dashboard");
      else if (role === "admin") navigate("/admin-dashboard");
      else navigate("/staff-dashboard");
    } catch (err) {
      console.error("Login failed:", err);

      const msg =
        err.response?.data?.detail ||
        err.response?.data ||
        err.message ||
        "Login failed";

      setError(typeof msg === "string" ? msg : "Login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/cyber.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,255,255,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "pulse 6s infinite alternate",
        }}
      />

      <div
        style={{
          background: "rgba(15, 25, 40, 0.8)",
          border: "1px solid rgba(0, 255, 255, 0.25)",
          boxShadow: "0 0 25px rgba(0, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          padding: "40px 50px",
          borderRadius: "30px",
          width: "380px",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          color: "#fff",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <img
            src="/images/login.jpg"
            alt="NISR Logo"
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgba(0,255,255,0.4)",
              backgroundColor: "rgba(255,255,255,0.9)",
              padding: "8px",
              boxShadow: "0 0 10px rgba(0,255,255,0.25)",
            }}
          />
        </div>

        <h2
          style={{
            color: "#00ffff",
            fontWeight: "700",
            marginBottom: "4px",
            letterSpacing: "1px",
            textShadow: "0 0 10px rgba(0,255,255,0.3)",
          }}
        >
          CYBERSECURITY
        </h2>
        <p style={{ color: "#a0cfd0", fontSize: "14px", marginBottom: "25px" }}>
          Stay secure, stay safe
        </p>

        {error && (
          <div
            style={{
              color: "#ff4c4c",
              background: "rgba(255, 0, 0, 0.08)",
              border: "1px solid rgba(255, 0, 0, 0.2)",
              padding: "8px",
              borderRadius: "6px",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ textAlign: "left" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              fontWeight: "500",
              marginBottom: "6px",
              color: "#00ffff",
            }}
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            placeholder="Enter your email"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "16px",
              borderRadius: "8px",
              border: "1px solid rgba(0,255,255,0.3)",
              background: "rgba(0, 0, 0, 0.25)",
              color: "#fff",
              outline: "none",
              fontSize: "14px",
            }}
          />

          <label
            htmlFor="password"
            style={{
              display: "block",
              fontWeight: "500",
              marginBottom: "6px",
              color: "#00ffff",
            }}
          >
            Password
          </label>
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={onChange}
              required
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "10px 36px 10px 10px",
                borderRadius: "8px",
                border: "1px solid rgba(0,255,255,0.3)",
                background: "rgba(0, 0, 0, 0.25)",
                color: "#fff",
                outline: "none",
                fontSize: "14px",
              }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#00ffff",
                fontSize: "13px",
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              background:
                "linear-gradient(90deg, rgba(0,255,255,0.5), rgba(0,180,255,0.7))",
              color: "#000",
              fontWeight: "600",
              border: "none",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              letterSpacing: "0.5px",
              boxShadow: "0 0 15px rgba(0,255,255,0.25)",
              transition: "all 0.3s ease",
            }}
          >
            Login
          </button>
        </form>

        <div
          style={{ textAlign: "center", marginTop: "12px", fontSize: "13px" }}
        >
          <a
            href="/forgot-password"
            style={{ color: "#00bfff", textDecoration: "none" }}
          >
            Forgot password?
          </a>
        </div>

        <p style={{ marginTop: "20px", fontSize: "12px", color: "#a0cfd0" }}>
          Secure your data, secure your future.
        </p>
      </div>

      <style>
        {`
          @keyframes pulse {
            from { opacity: 0.25; transform: scale(0.95); }
            to { opacity: 0.5; transform: scale(1.05); }
          }
        `}
      </style>
    </div>
  );
}
