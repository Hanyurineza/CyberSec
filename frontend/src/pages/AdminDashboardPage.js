// src/pages/AdminDashboardPage.js
import React, { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../layout/DashboardLayout";

export default function AdminDashboardPage() {
  const [staff, setStaff] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // load department staff + department reports
  useEffect(() => {
    async function load() {
      try {
        const [staffRes, reportsRes] = await Promise.all([
          api.get("/staff"),
          api.get("/reports"),
        ]);

        setStaff(staffRes.data || []);
        setReports(reportsRes.data || []);
      } catch (err) {
        console.error("AdminDashboard error", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ====== SIMPLE STATS ======
  const staffCount = staff.length;

  const totalAttempts = reports.reduce(
    (sum, r) => sum + (r.totalAttempts || 0),
    0
  );
  const avgScore =
    reports.length === 0
      ? 0
      : reports.reduce((sum, r) => sum + (r.awarenessScore || 0), 0) /
        reports.length;

  const activeStaffIds = new Set(reports.map((r) => r.userId));
  const activeStaffCount = activeStaffIds.size;

  return (
    <DashboardLayout>
      {/* ===== PAGE HEADER ===== */}
      <div style={headerRow}>
        <div>
          <h2 style={pageTitle}>Department Dashboard</h2>
          <p style={pageSub}>
            Overview of staff engagement and quiz performance in your
            department.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={loadingBox}>Loading department data…</div>
      ) : (
        <>
          {/* ===== TOP SUMMARY CARDS ===== */}
          <div style={cardGrid}>
            <StatCard
              label="Total Staff"
              value={staffCount}
              icon="👥"
              accent="#4e73df"
            />
            <StatCard
              label="Staff With Quiz Activity"
              value={activeStaffCount}
              icon="✅"
              accent="#1cc88a"
            />
            <StatCard
              label="Total Quiz Attempts"
              value={totalAttempts}
              icon="🧩"
              accent="#36b9cc"
            />
            <StatCard
              label="Average Awareness Score"
              value={`${Math.round(avgScore)}%`}
              icon="📊"
              accent="#f6c23e"
            />
          </div>

          {/* ===== MAIN CONTENT ROW ===== */}
          <div style={mainRow}>
            {/* LEFT: STAFF LIST */}
            <section style={panel}>
              <h3 style={panelTitle}>Department Staff</h3>
              <p style={panelHint}>
                All users in your department. Those in <strong>bold</strong>{" "}
                have at least one quiz report.
              </p>

              {staff.length === 0 ? (
                <p style={emptyText}>No staff records for this department.</p>
              ) : (
                <table style={table}>
                  <thead>
                    <tr>
                      <th style={th}>Name</th>
                      <th style={th}>Email</th>
                      <th style={th}>Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((s) => {
                      const isActive = activeStaffIds.has(s.userId);
                      return (
                        <tr key={s.userId}>
                          <td style={td}>
                            {isActive ? <strong>{s.name}</strong> : s.name}
                          </td>
                          <td style={td}>{s.email}</td>
                          <td style={td}>{s.department || "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </section>

            {/* RIGHT: PERFORMANCE SUMMARY */}
            <section style={{ ...panel, minWidth: 320 }}>
              <h3 style={panelTitle}>Department Performance</h3>
              {reports.length === 0 ? (
                <p style={emptyText}>
                  No quiz reports yet. Encourage staff to take awareness
                  quizzes.
                </p>
              ) : (
                <>
                  <p style={{ marginBottom: 10 }}>
                    Latest <strong>{Math.min(5, reports.length)}</strong> quiz
                    reports:
                  </p>

                  <ul style={reportList}>
                    {reports.slice(0, 5).map((r) => (
                      <li key={r.reportId} style={reportItem}>
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {staff.find((x) => x.userId === r.userId)?.name ||
                              "Unknown user"}
                          </div>
                          <div style={reportMeta}>
                            {r.totalAttempts} attempts •{" "}
                            {new Date(r.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={scorePill(r.awarenessScore)}>
                          {Math.round(r.awarenessScore)}%
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* simple “chart” style bar */}
                  <div style={{ marginTop: 18 }}>
                    <div style={miniLabel}>Average Awareness Score</div>
                    <div style={barOuter}>
                      <div
                        style={{
                          ...barInner,
                          width: `${Math.max(
                            5,
                            Math.min(100, Math.round(avgScore))
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

/* ========= SMALL COMPONENTS ========= */

function StatCard({ label, value, icon, accent }) {
  return (
    <div style={{ ...statCard, borderTopColor: accent }}>
      <div style={statIcon}>{icon}</div>
      <div style={{ fontSize: 13, color: "#6c757d", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#002b80" }}>
        {value}
      </div>
    </div>
  );
}

/* ========= STYLES ========= */

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
};

const pageTitle = {
  color: "#002b80",
  margin: 0,
};

const pageSub = {
  marginTop: 6,
  color: "#666",
};

const loadingBox = {
  padding: 24,
  background: "#f8f9fc",
  borderRadius: 12,
  textAlign: "center",
  marginTop: 16,
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: 18,
  marginTop: 16,
  marginBottom: 26,
};

const statCard = {
  background: "#fff",
  borderRadius: 12,
  padding: "14px 18px",
  boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
  borderTop: "4px solid #4e73df",
  display: "flex",
  flexDirection: "column",
};

const statIcon = {
  fontSize: 26,
  marginBottom: 6,
};

const mainRow = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 2.1fr) minmax(0, 1.2fr)",
  gap: 20,
  alignItems: "flex-start",
};

const panel = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
};

const panelTitle = {
  marginTop: 0,
  marginBottom: 8,
  color: "#002b80",
};

const panelHint = {
  marginTop: 0,
  marginBottom: 14,
  fontSize: 13,
  color: "#666",
};

const emptyText = {
  fontSize: 14,
  color: "#777",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 4,
  fontSize: 14,
};

const th = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "1px solid #e0e0e0",
  background: "#f8f9fc",
  color: "#495057",
};

const td = {
  padding: "8px 10px",
  borderBottom: "1px solid #f1f1f1",
};

const reportList = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const reportItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 0",
  borderBottom: "1px solid #f1f1f1",
};

const reportMeta = {
  fontSize: 12,
  color: "#777",
};

const scorePill = (score) => ({
  minWidth: 52,
  textAlign: "center",
  padding: "4px 8px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 600,
  background:
    score >= 70
      ? "rgba(40,167,69,0.12)"
      : score >= 40
      ? "rgba(255,193,7,0.15)"
      : "rgba(220,53,69,0.12)",
  color: score >= 70 ? "#28a745" : score >= 40 ? "#e0a800" : "#dc3545",
});

const miniLabel = {
  fontSize: 12,
  color: "#777",
  marginBottom: 4,
};

const barOuter = {
  width: "100%",
  height: 10,
  borderRadius: 999,
  background: "#e9ecef",
  overflow: "hidden",
};

const barInner = {
  height: "100%",
  borderRadius: 999,
  background: "linear-gradient(90deg,#4e73df,#1cc88a)",
  transition: "width 0.6s ease",
};
