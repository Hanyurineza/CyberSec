import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layout/DashboardLayout";

const API_BASE = "http://192.168.0.100:8000/api/policies";

export default function Policies() {
  const storedUser =
    JSON.parse(sessionStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("user"));

  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");

  const isSuperAdmin = storedUser?.role === "SuperAdmin";

  const [policies, setPolicies] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  /* ===============================
     LOAD POLICIES
  =============================== */
  const loadPolicies = async () => {
    const res = await axios.get(API_BASE, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPolicies(res.data);
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  /* ===============================
     UPLOAD POLICY
  =============================== */
  const uploadPolicy = async () => {
    if (!title || !file) {
      alert("Please provide title and PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    setLoading(true);

    await axios.post(API_BASE, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setTitle("");
    setFile(null);
    setLoading(false);
    loadPolicies();
  };

  /* ===============================
    VIEW POLICY
  =============================== */
  const previewPolicy = async (policyId) => {
    const res = await axios.get(`${API_BASE}/${policyId}/preview`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    const fileURL = window.URL.createObjectURL(
      new Blob([res.data], { type: "application/pdf" })
    );

    window.open(fileURL);
  };

  /* ===============================
    DOWNLOAD POLICY
  =============================== */
  const downloadPolicy = async (policyId, title) => {
    const res = await axios.get(`${API_BASE}/${policyId}/download`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  };

  /* ===============================
    DELETE POLICY
  =============================== */
  const deletePolicy = async (policyId) => {
    if (!window.confirm("Delete this policy?")) return;

    await axios.delete(`${API_BASE}/${policyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    loadPolicies();
  };

  /* ===============================
     EDIT POLICY
  =============================== */
  const editPolicy = async (policy) => {
    const newTitle = prompt("Edit policy title:", policy.title);
    if (!newTitle || newTitle === policy.title) return;

    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("description", policy.description || "");

    await axios.put(`${API_BASE}/${policy.policyId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    loadPolicies();
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1>📄 Cybersecurity Policies</h1>
        <p style={{ color: "#555", marginBottom: "20px" }}>
          Official cybersecurity awareness policies available for all staff.
        </p>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search policy..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, marginBottom: "16px" }}
        />

        {/* UPLOAD */}
        {isSuperAdmin && (
          <div style={cardStyle}>
            <h3 style={cardTitle}>Upload New Policy</h3>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Policy title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
              />

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                style={inputStyle}
              />

              <button
                style={primaryBtn}
                onClick={uploadPolicy}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Policy"}
              </button>
            </div>

            <p style={hintStyle}>
              Only PDF files are allowed. Uploaded policies will be visible to
              all users.
            </p>
          </div>
        )}

        {/* LIST */}
        <div style={cardStyle}>
          <h3 style={cardTitle}>Available Policies</h3>

          <div style={tableHeader}>
            <span>Title</span>
            <span>Uploaded By</span>
            <span>Date</span>
            <span style={{ textAlign: "right" }}>Actions</span>
          </div>

          {policies
            .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
            .map((p) => (
              <div key={p.policyId} style={tableRow}>
                <span>{p.title}</span>
                <span>{p.uploadedBy}</span>
                <span>{p.createdAt.split("T")[0]}</span>

                <div style={actionsContainer}>
                  <button
                    style={viewBtn}
                    onClick={() => previewPolicy(p.policyId)}
                  >
                    View
                  </button>

                  <button
                    style={downloadBtn}
                    onClick={() => downloadPolicy(p.policyId, p.title)}
                  >
                    Download
                  </button>

                  {isSuperAdmin && (
                    <>
                      <button style={editBtn} onClick={() => editPolicy(p)}>
                        Edit
                      </button>

                      <button
                        style={deleteBtn}
                        onClick={() => deletePolicy(p.policyId)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ================= STYLES ================= */

const cardStyle = {
  background: "#fff",
  borderRadius: "10px",
  padding: "20px",
  marginBottom: "24px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const cardTitle = { marginBottom: "16px", color: "#002b80" };

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  minWidth: "220px",
};

const primaryBtn = {
  background: "#002b80",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "6px",
  cursor: "pointer",
};

const hintStyle = { fontSize: "13px", color: "#777", marginTop: "10px" };

const tableHeader = {
  display: "grid",
  gridTemplateColumns: "2.5fr 2fr 1fr 2.5fr",
  fontWeight: 600,
  paddingBottom: "12px",
  borderBottom: "1px solid #e5e7eb",
  marginBottom: "8px",
};

const tableRow = {
  display: "grid",
  gridTemplateColumns: "2.5fr 2fr 1fr 2.5fr",
  alignItems: "center",
  padding: "12px 0",
  borderBottom: "1px solid #f0f0f0",
};

const actionsContainer = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "8px",
};

const baseActionBtn = {
  padding: "6px 12px",
  borderRadius: "6px",
  fontSize: "13px",
  cursor: "pointer",
  border: "1px solid transparent",
};

const viewBtn = {
  ...baseActionBtn,
  background: "#f1f5f9",
  color: "#1e293b",
  border: "1px solid #cbd5e1",
};

const downloadBtn = {
  ...baseActionBtn,
  background: "#2563eb",
  color: "#fff",
};

const editBtn = {
  ...baseActionBtn,
  background: "#f59e0b",
  color: "#fff",
};

const deleteBtn = {
  ...baseActionBtn,
  background: "#ef4444",
  color: "#fff",
};
