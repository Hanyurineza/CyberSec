// src/pages/StaffDashboardPage.js

import React, { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../layout/DashboardLayout";
import ReportChart from "../components/ReportChart";

export default function StaffDashboardPage() {
  console.log("STAFF DASHBOARD LOADED"); // keep for debug

  const [quizCount, setQuizCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tips, setTips] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const quizRes = await api.get("/quizzes");
        const reportRes = await api.get("/reports");
        const topicRes = await api.get("/topics");
        const tipRes = await api.get("/awareness/tips");

        setQuizCount(quizRes.data.length || 0);
        setResults(reportRes.data || []);
        setTopics(topicRes.data || []);
        setTips(tipRes.data || []);

        const completed = Math.min((reportRes.data || []).length * 10, 100);
        setProgress(completed);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      }
    }
    fetchData();
  }, []);

  // (…the rest of your JSX exactly as you already have…)

  return (
    <DashboardLayout>
      <h2 style={{ color: "#002b80", marginBottom: "10px" }}>
        My Cybersecurity Dashboard
      </h2>
      <p style={{ color: "#555", marginBottom: "24px" }}>
        Stay informed and track your cybersecurity learning performance.
      </p>

      {/* ====== SUMMARY CARDS ====== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <InfoCard
          title="Take a Quiz"
          value={`${quizCount} Available`}
          color="#007bff"
          link="/quiz"
          icon="🧩"
          desc="Challenge your cybersecurity knowledge."
        />
        <InfoCard
          title="My Progress"
          value={`${progress}% Completed`}
          color="#28a745"
          link="#progress"
          icon="📈"
          desc="Your current completion rate."
        />
        <InfoCard
          title="Overall Results"
          value={`${results.length} Reports`}
          color="#ffc107"
          link="/reports"
          icon="📊"
          desc="Analyze your quiz outcomes."
        />
        <InfoCard
          title="Awareness Topics"
          value={`${topics.length} Topics`}
          color="#17a2b8"
          link="/staff-awareness-topics"
          icon="🧠"
          desc="Learn key security practices."
        />
        <InfoCard
          title="Daily Tips"
          value={`${tips.length || 5} Tips`}
          color="#6f42c1"
          link="/send-tips"
          icon="💡"
          desc="Practical tips for daily safety."
        />
      </div>

      {/* ====== PROGRESS & CHART SECTION ====== */}
      <SectionCard title="My Progress Overview">
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              color: "#002b80",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Completion Progress
          </label>
          <div
            style={{
              height: "22px",
              background: "#e9ecef",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background:
                  progress < 50
                    ? "#ffc107"
                    : progress < 80
                    ? "#17a2b8"
                    : "#28a745",
                transition: "width 0.6s ease-in-out",
              }}
            ></div>
          </div>
          <p style={{ color: "#555", marginTop: "6px" }}>
            You’ve completed <strong>{progress}%</strong> of your learning
            activities.
          </p>
        </div>

        <div style={{ marginTop: "20px", height: "350px" }}>
          <ReportChart data={results} />
        </div>
      </SectionCard>

      {/* ====== AWARENESS TOPICS SECTION ======
      <SectionCard title="Awareness Topics">
        {topics.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {topics.slice(0, 4).map((t) => (
              <li
                key={t.topicId}
                style={{
                  marginBottom: "10px",
                  padding: "8px 10px",
                  background: "#f7faff",
                  borderRadius: "6px",
                }}
              >
                <strong style={{ color: "#002b80" }}>{t.title}</strong> —{" "}
                <a
                  href={t.contentLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#007bff", textDecoration: "none" }}
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#777" }}>No awareness topics yet.</p>
        )}
      </SectionCard> */}

      {/* ====== DAILY TIPS SECTION ====== */}
      <SectionCard title="Daily Cybersecurity Tips">
        {tips.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {tips.slice(0, 3).map((t, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "10px",
                  padding: "8px 10px",
                  background: "#eef6ff",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                💡 {t.tip || "Stay alert and think before you click."}
              </li>
            ))}
          </ul>
        ) : (
          <>
            <p style={{ color: "#666" }}>💡 Tip of the Day:</p>
            <p style={{ color: "#333", marginTop: "-5px" }}>
              Never share your password or PIN with anyone, even if they claim
              to be IT staff.
            </p>
          </>
        )}
      </SectionCard>

      {/* <p
        style={{
          fontSize: "13px",
          color: "#666",
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        © 2025 National Institute of Statistics of Rwanda — Cybersecurity
        Awareness Platform
      </p> */}
    </DashboardLayout>
  );
}

/* ====== CARD COMPONENT ====== */
function InfoCard({ title, value, color, icon, desc, link }) {
  return (
    <a
      href={link}
      style={{
        textDecoration: "none",
        color: "#002b80",
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        transition: "transform 0.2s, box-shadow 0.2s",
        borderTop: `4px solid ${color}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.08)";
      }}
    >
      <div style={{ fontSize: "28px", marginBottom: "8px" }}>{icon}</div>
      <h4 style={{ margin: "4px 0" }}>{title}</h4>
      <p
        style={{ color, fontWeight: "bold", fontSize: "17px", margin: "4px 0" }}
      >
        {value}
      </p>
      <p style={{ color: "#555", fontSize: "13px" }}>{desc}</p>
    </a>
  );
}

/* ====== SECTION WRAPPER ====== */
function SectionCard({ title, children }) {
  return (
    <section
      style={{
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
        padding: "20px",
        marginTop: "20px",
      }}
    >
      <h3 style={{ color: "#002b80", marginBottom: "12px" }}>{title}</h3>
      {children}
    </section>
  );
}
