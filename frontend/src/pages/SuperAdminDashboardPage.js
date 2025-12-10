import React, { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../layout/DashboardLayout";

export default function SuperAdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    departments: 0,
    topics: 0,
    attempts: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const users = await api.get("/staff");
        const topics = await api.get("/topics");
        const attempts = await api.get("/reports");

        // Count unique departments
        const depSet = new Set(users.data.map((u) => u.department));

        setStats({
          users: users.data.length,
          departments: depSet.size,
          topics: topics.data.length,
          attempts: attempts.data.length,
        });
      } catch (err) {
        console.error("Error loading SuperAdmin stats", err);
      }
    }
    loadStats();
  }, []);

  return (
    <DashboardLayout>
      <h2 style={{ color: "#002b80" }}>SuperAdmin Dashboard</h2>
      <p style={{ color: "#444", marginBottom: "20px" }}>
        System-wide overview of cybersecurity awareness platform usage.
      </p>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <StatCard
          label="Total Users"
          value={stats.users}
          icon="👥"
          color="#007bff"
        />
        <StatCard
          label="Departments"
          value={stats.departments}
          icon="🏢"
          color="#17a2b8"
        />
        <StatCard
          label="Topics"
          value={stats.topics}
          icon="📚"
          color="#ffc107"
        />
        <StatCard
          label="Quiz Attempts"
          value={stats.attempts}
          icon="📝"
          color="#28a745"
        />
      </div>

      <section
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{ color: "#002b80" }}>Platform Overview</h3>
        <p style={{ marginTop: 10 }}>More analytics coming soon...</p>
      </section>
    </DashboardLayout>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        borderTop: `4px solid ${color}`,
      }}
    >
      <div style={{ fontSize: 30 }}>{icon}</div>
      <h4 style={{ margin: "10px 0" }}>{label}</h4>
      <p style={{ fontSize: 22, fontWeight: "bold", color }}>{value}</p>
    </div>
  );
}
