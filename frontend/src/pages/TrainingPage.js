import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function TrainingPage() {
  const user = JSON.parse(
    sessionStorage.getItem("user") || localStorage.getItem("user")
  );
  const role = user?.role?.toLowerCase();

  // --- Hooks MUST stay here, at top level ---
  const [trainings, setTrainings] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);

  // Load trainings
  const load = async () => {
    const { data } = await api.get("/training");
    setTrainings(data);
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const createTraining = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/training", form);
      setForm({ title: "", description: "" });
      await load();
    } finally {
      setLoading(false);
    }
  };

  const removeTraining = async (id) => {
    await api.delete(`/training/${id}`);
    await load();
  };

  // --- Now block unauthorized users (AFTER hooks) ---
  if (role !== "superadmin") {
    return (
      <div style={{ padding: 24 }}>
        <h2>Unauthorized</h2>
        <p>You do not have permission to access training management.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Manage Trainings</h2>
      <p>Create cybersecurity training modules for staff.</p>

      {/* CREATE FORM */}
      <form
        onSubmit={createTraining}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 500,
          marginTop: 16,
        }}
      >
        <input
          name="title"
          placeholder="Training Title"
          value={form.title}
          onChange={onChange}
          required
          style={input}
        />

        <textarea
          name="description"
          placeholder="Training Description"
          rows={4}
          value={form.description}
          onChange={onChange}
          required
          style={textarea}
        />

        <button style={btn} disabled={loading}>
          {loading ? "Saving..." : "Add Training"}
        </button>
      </form>

      {/* TRAININGS LIST */}
      <h3 style={{ marginTop: 30 }}>Existing Trainings</h3>
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Title</th>
            <th style={th}>Description</th>
            <th style={th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {trainings.map((t) => (
            <tr key={t.trainingId}>
              <td style={td}>{t.title}</td>
              <td style={td}>{t.description}</td>
              <td style={td}>
                <button
                  style={deleteBtn}
                  onClick={() => removeTraining(t.trainingId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {!trainings.length && (
            <tr>
              <td colSpan="3" style={tdCenter}>
                No trainings yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ===== STYLES ===== */
const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 12,
};

const th = {
  padding: 10,
  background: "#003366",
  color: "white",
  border: "1px solid #ccc",
};

const td = {
  padding: 10,
  border: "1px solid #ccc",
};

const tdCenter = { ...td, textAlign: "center" };

const btn = {
  padding: "10px",
  background: "#0066cc",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const deleteBtn = {
  padding: "6px 10px",
  background: "red",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const input = {
  padding: "10px",
  borderRadius: 6,
  border: "1px solid #ccc",
};

const textarea = {
  padding: "10px",
  borderRadius: 6,
  border: "1px solid #ccc",
};
