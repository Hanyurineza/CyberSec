import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const { data } = await api.get("/topics");
    setTopics(data);
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setForm({ title: "", description: "", link: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        link: form.link,
      };

      if (editingId) {
        await api.put(`/topics/${editingId}`, payload);
      } else {
        await api.post("/topics", payload);
      }

      resetForm();
      await load();
    } finally {
      setLoading(false);
    }
  };

  const remove = async (topicId) => {
    if (!window.confirm("Delete this topic?")) return;
    await api.delete(`/topics/${topicId}`);
    await load();
  };

  const startEdit = (topic) => {
    setForm({
      title: topic.title || "",
      description: topic.description || "",
      link: topic.link || "",
    });
    setEditingId(topic.topicId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={tStyles.page}>
      {/* HEADER */}
      <div style={tStyles.headerBar}>
        <div>
          <h1 style={tStyles.title}>Awareness Topics</h1>
          <p style={tStyles.subtitle}>
            Create topics with descriptions and resource links so staff can
            access learning materials easily.
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <div style={tStyles.card}>
        <h2 style={tStyles.cardTitle}>
          {editingId ? "Edit Topic" : "Add New Topic"}
        </h2>

        <form onSubmit={handleSubmit} style={tStyles.form}>
          <div style={tStyles.fieldRow}>
            <label style={tStyles.label}>Title</label>
            <input
              style={tStyles.input}
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="e.g. Phishing Emails"
              required
            />
          </div>

          <div style={tStyles.fieldRow}>
            <label style={tStyles.label}>Description</label>
            <textarea
              style={{ ...tStyles.input, minHeight: 70, resize: "vertical" }}
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Short summary of what this topic covers"
            />
          </div>

          <div style={tStyles.fieldRow}>
            <label style={tStyles.label}>Resource Link</label>
            <input
              style={tStyles.input}
              name="link"
              value={form.link}
              onChange={onChange}
              placeholder="https://example.com/article-or-course"
            />
          </div>

          <div style={tStyles.formButtons}>
            <button
              type="submit"
              disabled={loading}
              style={tStyles.primaryButton}
            >
              {loading ? "Saving..." : editingId ? "Update Topic" : "Add Topic"}
            </button>
            {editingId && (
              <button
                type="button"
                style={tStyles.secondaryButton}
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TOPICS TABLE */}
      <div style={tStyles.card}>
        <h2 style={tStyles.cardTitle}>Topics Library</h2>

        <table style={tStyles.table}>
          <thead>
            <tr style={tStyles.tableHeadRow}>
              <th style={tStyles.th}>#</th>
              <th style={tStyles.th}>Title</th>
              <th style={tStyles.th}>Description</th>
              <th style={tStyles.th}>Resource</th>
              <th style={tStyles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((t, index) => (
              <tr key={t.topicId}>
                <td style={tStyles.td}>{index + 1}</td>
                <td style={tStyles.td}>{t.title}</td>
                <td style={tStyles.td}>{t.description || "-"}</td>
                <td style={tStyles.td}>
                  {t.link ? (
                    <a
                      href={t.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={tStyles.link}
                    >
                      Open
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td style={{ ...tStyles.td, whiteSpace: "nowrap" }}>
                  <button
                    type="button"
                    onClick={() => startEdit(t)}
                    style={tStyles.actionEdit}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(t.topicId)}
                    style={tStyles.actionDelete}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!topics.length && (
              <tr>
                <td colSpan="5" style={tStyles.tdCenter}>
                  No topics yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const tStyles = {
  page: {
    padding: "32px 40px",
    background: "#f5f7fb",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  headerBar: {
    borderBottom: "2px solid #e1e4ec",
    paddingBottom: 12,
    marginBottom: 24,
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    color: "#12375a",
  },
  subtitle: {
    margin: "4px 0 0 0",
    fontSize: 14,
    color: "#5f6b85",
  },
  card: {
    background: "#ffffff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 24,
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
  },
  cardTitle: {
    margin: "0 0 16px 0",
    fontSize: 18,
    fontWeight: 600,
    color: "#1f2933",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  fieldRow: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: "#4b5563",
  },
  input: {
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #cbd2e1",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },
  formButtons: {
    marginTop: 8,
    display: "flex",
    gap: 10,
  },
  primaryButton: {
    padding: "8px 18px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    background: "#004d99",
    color: "#ffffff",
  },
  secondaryButton: {
    padding: "8px 18px",
    borderRadius: 6,
    border: "1px solid #cbd2e1",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    background: "#ffffff",
    color: "#4b5563",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#ffffff",
  },
  tableHeadRow: {
    background: "#003366",
    color: "#ffffff",
  },
  th: {
    padding: 10,
    border: "1px solid #dde2f1",
    fontSize: 13,
    textAlign: "left",
  },
  td: {
    padding: 10,
    border: "1px solid #e1e4ec",
    fontSize: 13,
  },
  tdCenter: {
    padding: 12,
    border: "1px solid #e1e4ec",
    textAlign: "center",
    fontSize: 13,
    color: "#6b7280",
  },
  link: {
    fontSize: 13,
    textDecoration: "underline",
    cursor: "pointer",
  },
  actionEdit: {
    padding: "4px 10px",
    marginRight: 6,
    borderRadius: 4,
    border: "none",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 500,
    background: "#2563eb",
    color: "#ffffff",
  },
  actionDelete: {
    padding: "4px 10px",
    borderRadius: 4,
    border: "none",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 500,
    background: "#dc2626",
    color: "#ffffff",
  },
};
