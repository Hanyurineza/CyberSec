import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function SendTipsPage() {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    api.get("/awareness/tips").then((res) => setTips(res.data));
  }, []);

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>Daily Cybersecurity Tips</h1>
        <p style={styles.subtitle}>
          Quick, practical safety tips to help strengthen your cyber hygiene.
        </p>
      </div>

      {/* TIPS LIST */}
      <div style={styles.card}>
        {tips.length === 0 ? (
          <p style={{ color: "#6b7280", fontSize: 15 }}>No tips available.</p>
        ) : (
          <ul style={styles.tipList}>
            {tips.map((t, i) => (
              <li key={i} style={styles.tipItem}>
                <span style={styles.icon}>💡</span>
                <span>{t.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    padding: "40px",
    background: "#f4f7fc",
    minHeight: "100vh",
  },
  header: {
    marginBottom: 25,
  },
  title: {
    margin: 0,
    fontSize: 32,
    fontWeight: 700,
    color: "#102a43",
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    marginTop: 6,
  },
  card: {
    background: "#ffffff",
    padding: 25,
    borderRadius: 12,
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
  },
  tipList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  tipItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px 14px",
    marginBottom: 12,
    background: "#eef6ff",
    borderRadius: 8,
    fontSize: 15,
    lineHeight: 1.5,
    color: "#1d3557",
  },
  icon: {
    marginRight: 12,
    fontSize: 20,
  },
};
