import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function ManageStaffPage() {
  const currentUser = JSON.parse(
    sessionStorage.getItem("user") || localStorage.getItem("user")
  );
  const isSuperAdmin = currentUser?.role === "SuperAdmin";

  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    role: "Staff",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get("/staff");
      setStaff(data);
    } catch (error) {
      console.error(
        "Failed to load staff:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      department: "",
      role: "Staff",
      password: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // UPDATE existing staff
        const payload = {
          name: form.name,
          email: form.email,
          department: form.department,
          role: form.role,
        };
        if (form.password.trim()) {
          // optional new password
          payload.password = form.password;
        }
        await api.put(`/staff/${editingId}`, payload);
      } else {
        // CREATE new staff
        const payload = {
          name: form.name,
          email: form.email,
          department: form.department,
          role: form.role,
          password: form.password,
        };
        await api.post("/staff", payload);
      }

      resetForm();
      await load();
    } finally {
      setLoading(false);
    }
  };
  const remove = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/staff/${userId}`);
    await load();
  };
  const startEdit = (user) => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      department: user.department || "",
      role: user.role || "Staff",
      password: "",
    });
    setEditingId(user.userId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={styles.page}>
      {/* PAGE HEADER */}
      <div style={styles.headerBar}>
        <div>
          <h1 style={styles.title}>Manage Staff</h1>
          <p style={styles.subtitle}>
            Create, update and remove staff and admin accounts for the system.
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          {editingId ? "Edit Staff Member" : "Add New Staff"}
        </h2>

        <form onSubmit={handleSubmit} style={styles.formGrid}>
          <input
            style={styles.input}
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={onChange}
            required
          />

          <input
            style={styles.input}
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            required
          />

          <input
            style={styles.input}
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={onChange}
            required
          />

          <select
            style={styles.input}
            name="role"
            value={form.role}
            onChange={onChange}
          >
            <option value="Staff">Staff</option>
            {isSuperAdmin && <option value="Admin">Admin</option>}
            {isSuperAdmin && <option value="SuperAdmin">SuperAdmin</option>}
          </select>

          <input
            style={styles.input}
            name="password"
            type="password"
            placeholder={
              editingId ? "New password (optional)" : "Temporary Password"
            }
            value={form.password}
            onChange={onChange}
            required={!editingId}
          />

          <div style={styles.formButtons}>
            <button
              type="submit"
              disabled={loading}
              style={styles.primaryButton}
            >
              {loading ? "Saving..." : editingId ? "Update Staff" : "Add Staff"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={styles.secondaryButton}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLE CARD */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Staff List</h2>

        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeadRow}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.userId}>
                <td style={styles.td}>{s.userId}</td>
                <td style={styles.td}>{s.name}</td>
                <td style={styles.td}>{s.email}</td>
                <td style={styles.td}>{s.department || "-"}</td>
                <td style={styles.td}>{s.role}</td>
                <td style={{ ...styles.td, whiteSpace: "nowrap" }}>
                  <button
                    type="button"
                    onClick={() => startEdit(s)}
                    style={styles.actionEdit}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(s.userId)}
                    style={styles.actionDelete}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!staff.length && (
              <tr>
                <td colSpan="6" style={styles.tdCenter}>
                  No staff yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "32px 40px",
    background: "#f5f7fb",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  headerBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 24,
    borderBottom: "2px solid #e1e4ec",
    paddingBottom: 12,
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
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    alignItems: "center",
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
    gridColumn: "1 / 4",
    display: "flex",
    gap: 10,
    marginTop: 4,
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
