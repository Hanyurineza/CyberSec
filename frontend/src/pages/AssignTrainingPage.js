import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function AssignTrainingPage() {
  const user = JSON.parse(
    sessionStorage.getItem("user") || localStorage.getItem("user")
  );
  const role = user?.role?.toLowerCase();

  const [trainings, setTrainings] = useState([]);
  const [staff, setStaff] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [form, setForm] = useState({
    trainingId: "",
    userId: "",
  });

  // Load data
  const loadAll = async () => {
    const t = await api.get("/training");
    const s = await api.get("/staff");
    const a = await api.get("/training-session");

    setTrainings(t.data);
    setStaff(s.data);
    setAssignments(a.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ❗ Hooks above — now we can validate access
  if (role !== "superadmin") {
    return (
      <div style={{ padding: 24 }}>
        <h2>Unauthorized</h2>
        <p>You are not allowed to manage training assignments.</p>
      </div>
    );
  }

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const assignTraining = async (e) => {
    e.preventDefault();
    if (!form.trainingId || !form.userId) return;

    await api.post("/training-session", form);
    setForm({ trainingId: "", userId: "" });
    await loadAll();
  };

  const removeAssignment = async (id) => {
    await api.delete(`/training-session/${id}`);
    await loadAll();
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Assign Trainings to Staff</h2>
      <p>SuperAdmin can assign any training.</p>

      <form
        onSubmit={assignTraining}
        style={{
          display: "flex",
          gap: 12,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <select
          name="trainingId"
          value={form.trainingId}
          onChange={onChange}
          style={select}
        >
          <option value="">Select training</option>
          {trainings.map((t) => (
            <option key={t.trainingId} value={t.trainingId}>
              {t.title}
            </option>
          ))}
        </select>

        <select
          name="userId"
          value={form.userId}
          onChange={onChange}
          style={select}
        >
          <option value="">Select staff</option>
          {staff.map((s) => (
            <option key={s.userId} value={s.userId}>
              {s.name} — {s.department}
            </option>
          ))}
        </select>

        <button style={btn}>Assign</button>
      </form>

      <h3>Assigned Trainings</h3>

      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Staff</th>
            <th style={th}>Training</th>
            <th style={th}>Status</th>
            <th style={th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((a) => (
            <tr key={a.sessionId}>
              <td style={td}>
                {a.user?.name}
                <br />
                <small>{a.user?.email}</small>
              </td>

              <td style={td}>{a.training?.title}</td>
              <td style={td}>{a.status}</td>

              <td style={td}>
                <button
                  style={deleteBtn}
                  onClick={() => removeAssignment(a.sessionId)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}

          {!assignments.length && (
            <tr>
              <td colSpan="4" style={tdCenter}>
                No training assignments yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ===== STYLES ===== */

const select = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const btn = {
  padding: "10px 16px",
  background: "#0066cc",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

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

const deleteBtn = {
  padding: "6px 10px",
  background: "red",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
