import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function ManageTipsPage() {
  const [tips, setTips] = useState([]);
  const [newTip, setNewTip] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const loadTips = async () => {
    const { data } = await api.get("/awareness/tips");
    setTips(data);
  };

  const addTip = async (e) => {
    e.preventDefault();
    if (!newTip.trim()) return;

    await api.post("/awareness/tips", { description: newTip });
    setNewTip("");
    loadTips();
  };

  const saveEdit = async (id) => {
    await api.put(`/awareness/tips/${id}`, { description: editValue });
    setEditingId(null);
    loadTips();
  };

  const deleteTip = async (id) => {
    if (!window.confirm("Delete this tip?")) return;
    await api.delete(`/awareness/tips/${id}`);
    loadTips();
  };

  useEffect(() => {
    loadTips();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Manage Cybersecurity Tips</h2>

        {/* Add Tip */}
        <form onSubmit={addTip} style={styles.addForm}>
          <input
            style={styles.input}
            value={newTip}
            onChange={(e) => setNewTip(e.target.value)}
            placeholder="Enter new cybersecurity tip"
          />
          <button type="submit" style={styles.primaryBtn}>
            Add Tip
          </button>
        </form>

        {/* Tips Table */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tips.map((tip, index) => (
              <tr key={tip.tipId || index}>
                <td style={styles.td}>{index + 1}</td>

                <td style={styles.td}>
                  {editingId === tip.tipId ? (
                    <input
                      style={styles.input}
                      value={editValue ?? ""}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                  ) : (
                    tip.description
                  )}
                </td>

                <td style={styles.td}>
                  {editingId === tip.tipId ? (
                    <>
                      <button
                        onClick={() => saveEdit(tip.tipId)}
                        style={styles.saveBtn}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={styles.cancelBtn}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(tip.tipId);
                          setEditValue(tip.description);
                        }}
                        style={styles.editBtn}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteTip(tip.tipId)}
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {!tips.length && (
              <tr>
                <td colSpan="3" style={styles.noData}>
                  No tips available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------ Styles ------------------ */

const styles = {
  page: {
    padding: "32px 40px",
    background: "#f5f7fb",
    minHeight: "100vh",
  },
  card: {
    background: "#fff",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 20,
    color: "#12375a",
  },
  addForm: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  primaryBtn: {
    padding: "8px 16px",
    background: "#005bbb",
    border: "none",
    color: "white",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "12px 8px",
    background: "#003366",
    color: "white",
    fontWeight: 600,
    fontSize: 14,
    textAlign: "left",
  },
  td: {
    padding: "10px 8px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: 14,
  },
  editBtn: {
    padding: "4px 10px",
    marginRight: 8,
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "4px 10px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  saveBtn: {
    padding: "4px 10px",
    marginRight: 8,
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "4px 10px",
    background: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  noData: {
    padding: 20,
    textAlign: "center",
    color: "#555",
    fontStyle: "italic",
  },
};
