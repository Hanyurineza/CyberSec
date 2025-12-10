import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom"; // <-- ADD THIS

export default function StaffTopicsPage() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    api.get("/topics").then((res) => setTopics(res.data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Awareness Topics</h2>

      {topics.length === 0 ? (
        <p>No awareness topics available.</p>
      ) : (
        topics.map((t) => (
          <div
            key={t.topicId}
            style={{
              marginBottom: 20,
              background: "#f8f9fc",
              padding: 15,
              borderRadius: 8,
              borderLeft: "5px solid #0d6efd",
            }}
          >
            <h3 style={{ marginBottom: 5, color: "#003366" }}>{t.title}</h3>
            <p style={{ color: "#555", marginBottom: 10 }}>{t.description}</p>

            {/* 🔥 VIEW BUTTON (GOES TO TopicDetailPage) */}
            <Link
              to={`/topic-view?id=${t.topicId}`}
              style={{
                padding: "6px 14px",
                background: "#0d6efd",
                color: "#fff",
                textDecoration: "none",
                borderRadius: 5,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              View Topic →
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
