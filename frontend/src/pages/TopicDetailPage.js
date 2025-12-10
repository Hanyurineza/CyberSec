import React, { useEffect, useState } from "react";
import api from "../api/api";
import "./topic-details.css";

export default function TopicDetailPage() {
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    async function load() {
      const id = new URLSearchParams(window.location.search).get("id");
      const { data } = await api.get(`/topics/${id}`);
      setTopic(data);
    }
    load();
  }, []);

  if (!topic) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-2">Loading topic...</p>
      </div>
    );
  }

  return (
    <div className="topic-details-wrapper">
      <div className="topic-card shadow-sm">
        <h1 className="topic-title">{topic.title}</h1>

        <p className="topic-description">{topic.description}</p>

        {topic.link && (
          <div className="resource-box mt-4">
            <h4>📘 Additional Resource</h4>
            <p className="resource-text">
              Open the learning material below to understand this topic better.
            </p>
            <a
              href={topic.link}
              target="_blank"
              rel="noreferrer"
              className="resource-btn"
            >
              Open Resource
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
